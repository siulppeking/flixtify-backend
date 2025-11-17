// authController.js
// --------------------------------------------------------------------------------
// NOTA: Asegúrate de que los archivos de los modelos (User, Role, UserRole, etc.) 
// estén correctamente definidos con el esquema desacoplado y guardados en 
// la carpeta "../models/".
// --------------------------------------------------------------------------------

const User = require("../models/User");
const Role = require("../models/Role");
const Token = require("../models/Token");
const UserRole = require("../models/UserRole"); // <-- Colección de enlace Usuario-Rol
const RoleMenu = require("../models/RoleMenu"); // <-- Colección de enlace Rol-Menú
const Menu = require("../models/Menu");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// --- FUNCIONES DE AUTENTICACIÓN BÁSICA ---

// Register: Crea usuario y le asigna el rol por defecto como ACTIVO
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);

        // 1. Crear el usuario
        const user = await User.create({
            username,
            email,
            password: hashed
        });

        // 2. Obtener el rol por defecto (Ej: "USER")
        const defaultRole = await Role.findOne({ name: "USER" });

        // 3. Crear el enlace UserRole y marcarlo como ACTIVO
        if (defaultRole) {
            await UserRole.create({
                userId: user._id,
                roleId: defaultRole._id,
                isActive: true
            });
        }

        res.status(201).json({ message: "User created", userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login: Autentica, busca el rol ACTIVO y lo incluye en el JWT
exports.login = async (req, res) => {
    try {
        const { email, password, twoFAToken } = req.body;

        // 1. Verificar usuario y contraseña
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.enabled) return res.status(403).json({ message: "User disabled" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        // 2. Verificar 2FA
        if (user.twoFA.enabled) {
            if (!twoFAToken) return res.status(401).json({ message: "2FA token required" });
            const verified = speakeasy.totp.verify({
                secret: user.twoFA.secret,
                encoding: "base32",
                token: twoFAToken
            });
            if (!verified) return res.status(401).json({ message: "Invalid 2FA token" });
        }

        // 3. Obtener el Rol Activo
        const activeUserRole = await UserRole.findOne({ userId: user._id, isActive: true }).populate('roleId');

        if (!activeUserRole) {
            return res.status(403).json({ message: "No active role assigned." });
        }

        const activeRoleId = activeUserRole.roleId._id;

        // 4. Generar Tokens (INCLUIR activeRoleId en el Access Token)
        const accessToken = jwt.sign(
            { id: user._id, activeRoleId: activeRoleId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { id: user._id, activeRoleId: activeRoleId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // 5. Guardar Refresh Token
        await Token.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            userAgent: req.headers["user-agent"],
            ip: req.ip
        });

        // 6. Obtener todos los roles para el response
        const allUserRoles = await UserRole.find({ userId: user._id }).populate('roleId');
        const rolesNames = allUserRoles.map(ur => ur.roleId.name);


        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                activeRole: activeUserRole.roleId.name,
                roles: rolesNames // Todos los roles que posee
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

        await Token.deleteOne({ refreshToken });
        res.json({ message: "Logged out" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Refresh
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

        const stored = await Token.findOne({ refreshToken });
        if (!stored) return res.status(401).json({ message: "Invalid token" });
        if (stored.expiresAt < new Date()) {
            await Token.deleteOne({ refreshToken });
            return res.status(401).json({ message: "Token expired, please log in again" });
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Re-generar un nuevo access token con el ID y el activeRoleId del payload del refresh token
        const accessToken = jwt.sign(
            { id: payload.id, activeRoleId: payload.activeRoleId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// --- GESTIÓN DE ROL ACTIVO Y MENÚS ---

// Switch Active Role: Desactiva el rol actual y activa el nuevo.
exports.switchActiveRole = async (req, res) => {
    try {
        const userId = req.user.id; // Obtenido del JWT (ver middleware de autenticación)
        const { newRoleId } = req.body;

        // 1. Verificar si el usuario tiene el nuevo rol
        const newUserRole = await UserRole.findOne({ userId, roleId: newRoleId });
        if (!newUserRole) {
            return res.status(403).json({ message: "Role not assigned to user" });
        }

        // 2. Desactivar el rol activo actual del usuario
        await UserRole.updateMany(
            { userId: userId, isActive: true },
            { $set: { isActive: false } }
        );

        // 3. Activar el nuevo rol
        newUserRole.isActive = true;
        await newUserRole.save();

        // 4. Generar un NUEVO Access Token con el nuevo activeRoleId
        const accessToken = jwt.sign(
            { id: userId, activeRoleId: newRoleId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({
            message: "Active role switched successfully. New token provided.",
            accessToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user menus: Obtiene los menús para el rol activo
exports.getMyMenus = async (req, res) => {
    try {
        // Obtenemos el activeRoleId directamente del JWT (asumiendo que el middleware lo ha decodificado)
        const activeRoleId = req.user.activeRoleId;

        if (!activeRoleId) {
            return res.status(403).json({ message: "No active role ID found in token." });
        }

        // 1. Obtener los enlaces RoleMenu para ese Rol Activo
        const roleMenus = await RoleMenu.find({ roleId: activeRoleId }).populate("menuId");

        // 2. Mapear y filtrar los datos de los menús para el frontend
        const menus = roleMenus
            .filter(rm => rm.menuId) // Asegurarse de que el menú existe
            .map(rm => ({
                id: rm.menuId._id,
                name: rm.menuId.name,
                path: rm.menuId.path,
                icon: rm.menuId.icon,
                type: rm.menuId.type, // (menu, submenu, form)
                parent: rm.menuId.parent
            }));

        res.json(menus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// --- FUNCIONES 2FA (Se mantienen con ajustes menores) ---

// Enable 2FA
exports.enable2FA = async (req, res) => {
    try {
        // Asumiendo que req.user.id es el ID del usuario autenticado
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const secret = speakeasy.generateSecret({ name: "Flixtify" });
        user.twoFA.secret = secret.base32;
        user.twoFA.enabled = true;
        await user.save();

        const qr = await QRCode.toDataURL(secret.otpauth_url);
        res.json({ qrCode: qr, secret: secret.base32 });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Verify 2FA
exports.verify2FA = async (req, res) => {
    try {
        const { token } = req.body;
        // Asumiendo que req.user.id es el ID del usuario autenticado
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const verified = speakeasy.totp.verify({
            secret: user.twoFA.secret,
            encoding: "base32",
            token
        });

        if (!verified) return res.status(400).json({ message: "Invalid token" });

        user.twoFA.verified = true;
        await user.save();

        res.json({ message: "2FA verified" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};