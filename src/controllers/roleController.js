// Role Controller - Manages role creation, update, deletion, and role-based permissions
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const RoleMenu = require('../models/RoleMenu');

// Constants for consistent messaging
const ERROR_MESSAGES = {
  ROLE_NOT_FOUND: 'Role not found',
  ROLE_NOT_FOUND_UPDATE: 'Role not found for update',
  ROLE_NOT_FOUND_DELETE: 'Role not found for deletion',
  ROLE_NAME_REQUIRED: 'Role name is required',
  ROLE_EXISTS: 'A role with this name already exists',
  ROLE_IN_USE: 'Cannot delete role. Users are still assigned to this role',
  SERVER_ERROR_FETCH: 'Server error fetching roles',
  SERVER_ERROR_FETCH_SINGLE: 'Server error fetching role',
  SERVER_ERROR_CREATE: 'Server error creating role',
  SERVER_ERROR_UPDATE: 'Server error updating role',
  SERVER_ERROR_DELETE: 'Server error deleting role'
};

const SUCCESS_MESSAGES = {
  ROLE_CREATED: 'Role created successfully',
  ROLE_UPDATED: 'Role updated successfully',
  ROLE_DELETED: 'Role and all its associated menu permissions deleted successfully'
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND });
    }
    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH_SINGLE });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: ERROR_MESSAGES.ROLE_NAME_REQUIRED });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: ERROR_MESSAGES.ROLE_EXISTS });
    }

    const newRole = await Role.create({ name, description });
    res.status(201).json({
      message: SUCCESS_MESSAGES.ROLE_CREATED,
      role: newRole
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_CREATE });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND_UPDATE });
    }

    res.json({
      message: SUCCESS_MESSAGES.ROLE_UPDATED,
      role: updatedRole
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_UPDATE });
  }
};

// --- Función 5: Eliminar un rol (Delete) ---
// **IMPORTANTE:** Debe verificar y limpiar las referencias en las tablas de enlace.
exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: ERROR_MESSAGES.ROLE_NOT_FOUND_DELETE });
    }

    // 1. Verificar si el rol está en uso por algún usuario
    const usersAssigned = await UserRole.countDocuments({ roleId });
    if (usersAssigned > 0) {
      return res.status(400).json({
        message: `${ERROR_MESSAGES.ROLE_IN_USE}. ${usersAssigned} users are still assigned to this role.`
      });
    }

    // 2. Eliminar todas las relaciones en RoleMenu (permisos de navegación)
    await RoleMenu.deleteMany({ roleId });

    // 3. Eliminar la entidad Role
    await Role.deleteOne({ _id: roleId });

    res.json({
      message: SUCCESS_MESSAGES.ROLE_DELETED
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_DELETE });
  }
};