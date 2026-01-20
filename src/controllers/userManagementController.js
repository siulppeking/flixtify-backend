// User Management Controller - Manages user CRUD operations and user-role associations
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const Role = require('../models/Role');

// Constants
const USER_PROJECTION = '-password -twoFA.secret';

const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  SELF_MODIFICATION: 'Cannot modify your own account via admin route. Use /profile instead',
  SELF_DELETION: 'Cannot delete your own account',
  SERVER_ERROR_FETCH: 'Server error fetching users',
  SERVER_ERROR_FETCH_SINGLE: 'Server error fetching user',
  SERVER_ERROR_UPDATE: 'Server error updating user',
  SERVER_ERROR_DELETE: 'Server error deleting user'
};

const SUCCESS_MESSAGES = {
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User and associated roles deleted successfully'
};

/**
 * Retrieves all roles assigned to a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of role objects with id, name, and isActive
 */
const getAssignedRoles = async (userId) => {
  const userAssignments = await UserRole.find({ userId }).populate('roleId', 'name');
  return userAssignments.map(assignment => ({
    id: assignment.roleId._id,
    name: assignment.roleId.name,
    isActive: assignment.isActive
  }));
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(USER_PROJECTION);

    const usersWithRoles = await Promise.all(users.map(async (user) => {
      const roles = await getAssignedRoles(user._id);
      return {
        ...user.toObject(),
        roles
      };
    }));

    res.json(usersWithRoles);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(USER_PROJECTION);
    if (!user) {
      return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    const roles = await getAssignedRoles(userId);

        res.json({
            ...user.toObject(),
            roles: roles
        });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH_SINGLE });
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
            return res.status(400).json({ message: ERROR_MESSAGES.SELF_MODIFICATION });
        }

        // Excluir la posibilidad de que el admin intente cambiar la contraseña por esta ruta
        delete updates.password;

        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select(USER_PROJECTION);

        if (!updatedUser) {
            return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }

        res.json({
            message: SUCCESS_MESSAGES.USER_UPDATED,
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_UPDATE });
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
            return res.status(400).json({ message: ERROR_MESSAGES.SELF_DELETION });
        }

        // 1. Eliminar todas las asignaciones de roles para ese usuario
        await UserRole.deleteMany({ userId: targetUserId });

        // 2. Eliminar al usuario
        const result = await User.deleteOne({ _id: targetUserId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }

        // Opcional (si implementas lógica de negocio): 
        // También deberías limpiar/re-asignar sus Proyectos y Tareas (Project.ownerId y Task.assignedTo)

        res.json({ message: SUCCESS_MESSAGES.USER_DELETED });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_DELETE });
    }
};