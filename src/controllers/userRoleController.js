const UserRole = require("../models/UserRole");
const User = require("../models/User");
const Role = require("../models/Role");

// --- Función 1: Asignar un Rol a un Usuario (Create / Assign) ---
// POST /user-roles
exports.assignRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        if (!userId || !roleId) {
            return res.status(400).json({ message: "userId and roleId are required." });
        }

        // 1. Verificar si la asignación ya existe
        const existingAssignment = await UserRole.findOne({ userId, roleId });
        if (existingAssignment) {
            return res.status(400).json({ message: "This role is already assigned to this user." });
        }

        // 2. Opcional: Verificar que User y Role IDs sean válidos
        const userExists = await User.findById(userId);
        const roleExists = await Role.findById(roleId);

        if (!userExists || !roleExists) {
            return res.status(404).json({ message: "One or both IDs (User or Role) are invalid or not found." });
        }

        // 3. Crear el enlace (por defecto, isActive: false)
        // La activación se maneja en el login o en el switchRole
        const newAssignment = await UserRole.create({ userId, roleId, isActive: false });

        res.status(201).json({
            message: "Role assigned to user successfully.",
            assignment: newAssignment
        });
    } catch (error) {
        console.error("Error assigning role to user:", error);
        res.status(500).json({ message: "Server error assigning role." });
    }
};

// --- Función 2: Revocar un Rol de un Usuario (Delete / Revoke) ---
// DELETE /user-roles/:userId/:roleId
exports.revokeRoleFromUser = async (req, res) => {
    try {
        const { userId, roleId } = req.params;

        // 1. Verificar si el rol es el rol activo del usuario
        const activeAssignment = await UserRole.findOne({ userId, roleId, isActive: true });
        if (activeAssignment) {
            return res.status(400).json({
                message: "Cannot revoke: This role is currently the user's active role. Please switch roles first."
            });
        }

        // 2. Eliminar el enlace
        const result = await UserRole.deleteOne({ userId, roleId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Assignment not found." });
        }

        res.json({ message: "Role revoked from user successfully." });
    } catch (error) {
        console.error("Error revoking role from user:", error);
        res.status(500).json({ message: "Server error revoking role." });
    }
};

// --- Función 3: Obtener Roles Asignados a un Usuario (Read By User) ---
// GET /user-roles/:userId
exports.getRolesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1. Encontrar todos los enlaces para ese User
        const assignments = await UserRole.find({ userId }).populate('roleId');

        // 2. Mapear para devolver los detalles del rol, incluyendo si está activo
        const roles = assignments.map(a => ({
            roleId: a.roleId._id,
            name: a.roleId.name,
            description: a.roleId.description,
            isActive: a.isActive
        }));

        res.json(roles);
    } catch (error) {
        console.error("Error fetching roles by user:", error);
        res.status(500).json({ message: "Server error fetching roles by user." });
    }
};