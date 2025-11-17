const User = require("../models/User");
const UserRole = require("../models/UserRole");
const Role = require("../models/Role"); // Necesario para buscar el rol 'ADMIN' si es necesario

// --- Función Auxiliar: Obtener roles asignados a un usuario ---
const getAssignedRoles = async (userId) => {
    const userAssignments = await UserRole.find({ userId }).populate('roleId', 'name');
    return userAssignments.map(assignment => ({
        id: assignment.roleId._id,
        name: assignment.roleId.name,
        isActive: assignment.isActive
    }));
};

// --- READ All Users (Solo para Admin) ---
// GET /admin/users
exports.getAllUsers = async (req, res) => {
    try {
        // Excluir información sensible como la contraseña y el secreto 2FA
        const users = await User.find().select('-password -twoFA.secret');

        // Opcional: Adjuntar los roles de cada usuario para la interfaz de administración
        const usersWithRoles = await Promise.all(users.map(async (user) => {
            const roles = await getAssignedRoles(user._id);
            return {
                ...user.toObject(),
                roles: roles
            };
        }));

        res.json(usersWithRoles);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Server error fetching users." });
    }
};

// --- READ One User by ID (Solo para Admin) ---
// GET /admin/users/:id
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select('-password -twoFA.secret');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Adjuntar los roles
        const roles = await getAssignedRoles(userId);

        res.json({
            ...user.toObject(),
            roles: roles
        });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Server error fetching user." });
    }
};


// --- UPDATE User Status/Info (Solo para Admin) ---
// PUT /admin/users/:id
exports.updateUser = async (req, res) => {
    try {
        const adminId = req.user.id; // El ID del administrador logueado
        const targetUserId = req.params.id; // El ID del usuario a modificar
        const updates = req.body;

        // PRECAUCIÓN: No permitir que un administrador cambie su propia cuenta por esta ruta.
        // Las actualizaciones personales deben ir por /profile.
        if (adminId === targetUserId) {
            return res.status(400).json({ message: "Cannot modify your own account via admin route. Use /profile instead." });
        }

        // Excluir la posibilidad de que el admin intente cambiar la contraseña por esta ruta
        delete updates.password;

        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password -twoFA.secret');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({
            message: "User updated successfully.",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error updating user." });
    }
};


// --- DELETE User (Solo para Admin) ---
// DELETE /admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const adminId = req.user.id;
        const targetUserId = req.params.id;

        // PRECAUCIÓN: Impedir que un administrador se elimine a sí mismo
        if (adminId === targetUserId) {
            return res.status(400).json({ message: "Cannot delete your own account." });
        }

        // 1. Eliminar todas las asignaciones de roles para ese usuario
        await UserRole.deleteMany({ userId: targetUserId });

        // 2. Eliminar al usuario
        const result = await User.deleteOne({ _id: targetUserId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        // Opcional (si implementas lógica de negocio): 
        // También deberías limpiar/re-asignar sus Proyectos y Tareas (Project.ownerId y Task.assignedTo)

        res.json({ message: "User and associated roles deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error deleting user." });
    }
};