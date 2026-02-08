/**
 * User Role Controller
 *
 * Manages user-role assignments and relationships.
 * Handles assignment and revocation of roles to/from users.
 * Maintains the core RBAC system by managing user-role bindings.
 *
 * @module controllers/userRoleController
 * @requires ../models/Role
 * @requires ../models/User
 * @requires ../models/UserRole
 */
const Role = require('../models/Role');
const User = require('../models/User');
const UserRole = require('../models/UserRole');

/**
 * Error messages for user-role assignment operations
 * @type {Object.<string, string>}
 */
const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'userId and roleId are required',
  ROLE_ALREADY_ASSIGNED: 'This role is already assigned to this user',
  INVALID_IDS: 'One or both IDs (User or Role) are invalid or not found',
  ASSIGNMENT_NOT_FOUND: 'Assignment not found',
  ACTIVE_ROLE_ERROR: "Cannot revoke: This role is currently the user's active role. Please switch roles first",
  SERVER_ERROR_ASSIGN: 'Server error assigning role',
  SERVER_ERROR_REVOKE: 'Server error revoking role',
  SERVER_ERROR_FETCH: 'Server error fetching roles by user'
};

const SUCCESS_MESSAGES = {
  ROLE_ASSIGNED: 'Role assigned to user successfully',
  ROLE_REVOKED: 'Role revoked from user successfully',
  ROLES_FETCHED: 'Roles fetched successfully'
};

/**
 * Validates that both userId and roleId exist in database
 * @param {string} userId - The user ID to validate
 * @param {string} roleId - The role ID to validate
 * @returns {Promise<boolean>} True if both user and role exist
 */
const isUserRoleValid = async (userId, roleId) => {
  const user = await User.findById(userId);
  const role = await Role.findById(roleId);
  return !!(user && role);
};

/**
 * Format role assignment data for response
 * @param {Object} assignment - The role assignment object
 * @returns {Object} Formatted assignment data
 */
const formatRoleAssignment = (assignment) => {
  const { roleId, isActive } = assignment;
  return {
    roleId: roleId._id,
    name: roleId.name,
    description: roleId.description,
    isActive
  };
};

exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
    }

    const existingLink = await UserRole.findOne({ userId, roleId });
    if (existingLink) {
      return res.status(400).json({ message: ERROR_MESSAGES.ROLE_ALREADY_ASSIGNED });
    }

    const isValid = await isUserRoleValid(userId, roleId);
    if (!isValid) {
      return res.status(404).json({ message: ERROR_MESSAGES.INVALID_IDS });
    }

    const newAssignment = await UserRole.create({ userId, roleId, isActive: false });

    res.status(201).json({
      message: SUCCESS_MESSAGES.ROLE_ASSIGNED,
      assignment: newAssignment
    });
  } catch (error) {
    console.error('Error assigning role to user:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_ASSIGN });
  }
};

exports.revokeRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.params;

    const activeAssignment = await UserRole.findOne({ userId, roleId, isActive: true });
    if (activeAssignment) {
      return res.status(400).json({
        message: ERROR_MESSAGES.ACTIVE_ROLE_ERROR
      });
    }

    // 2. Eliminar el enlace
    const result = await UserRole.deleteOne({ userId, roleId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.ASSIGNMENT_NOT_FOUND });
    }

    res.json({ message: SUCCESS_MESSAGES.ROLE_REVOKED });
  } catch (error) {
    console.error('Error revoking role from user:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_REVOKE });
  }
};

// --- Get Roles Assigned to a User (Read By User) ---
// GET /user-roles/:userId
/**
 * Get all roles assigned to a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.getRolesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Encontrar todos los enlaces para ese User
    const assignments = await UserRole.find({ userId }).populate('roleId');

    // 2. Mapear para devolver los detalles del rol, incluyendo si está activo
    const roles = assignments.map(formatRoleAssignment);

    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles by user:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH });
  }
};