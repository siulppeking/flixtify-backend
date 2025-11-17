// middlewares/checkAdmin.js

const UserRole = require("../models/UserRole"); // Necesario para buscar el nombre del rol
const Role = require("../models/Role"); // Necesario para buscar el nombre del rol

const checkAdmin = async (req, res, next) => {
    try {
        const activeRoleId = req.user.activeRoleId; // Obtenido del token por authMiddleware

        if (!activeRoleId) {
            return res.status(403).json({ message: "Access denied: No active role found." });
        }

        // 1. Encontrar el nombre del rol activo
        // Necesitamos 'Role' para verificar el nombre ("ADMIN")
        const activeRole = await Role.findById(activeRoleId);

        if (!activeRole) {
            return res.status(403).json({ message: "Access denied: Role not recognized." });
        }

        // 2. Verificar si el nombre del rol es 'ADMIN'
        if (activeRole.name !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Requires ADMIN privileges." });
        }

        // 3. Si es ADMIN, permite continuar
        next();

    } catch (error) {
        console.error("Authorization error:", error);
        res.status(500).json({ message: "Authorization verification failed." });
    }
};

module.exports = checkAdmin;