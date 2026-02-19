/**
 * Role Menu Controller
 *
 * Manages mapping of menus to roles for access control.
 * Handles assignment and revocation of menu items to/from roles.
 * Implements menu visibility rules based on user role assignments.
 *
 * @module controllers/roleMenuController
 * @requires ../models/Menu
 * @requires ../models/Role
 * @requires ../models/RoleMenu
 */
const Menu = require('../models/Menu');
const Role = require('../models/Role');
const RoleMenu = require('../models/RoleMenu');
const mongoose = require('mongoose');

// Role-menu operation status codes
const ROLE_MENU_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

/**
 * Error messages for role-menu assignment operations
 * @type {Object.<string, string>}
 */
const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'roleId and menuId are required',
  REQUIRED_PARAMS: 'roleId and menuId must be provided in the URL',
  MENU_ALREADY_ASSIGNED: 'This menu is already assigned to this role',
  INVALID_IDS: 'One or both IDs (Role or Menu) are invalid or not found',
  ASSIGNMENT_NOT_FOUND: 'Assignment not found',
  SERVER_ERROR_ASSIGN: 'Server error assigning menu',
  SERVER_ERROR_REVOKE: 'Server error revoking menu',
  SERVER_ERROR_FETCH: 'Server error fetching menus by role'
};

const SUCCESS_MESSAGES = {
  MENU_ASSIGNED: 'Menu assigned to role successfully',
  MENU_REVOKED: 'Menu permission revoked from role successfully',
  MENUS_FETCHED: 'Menus fetched successfully'
};

/**
 * Validates that both roleId and menuId exist in database
 * @param {string} roleId - The role ID to validate
 * @param {string} menuId - The menu ID to validate
 * @returns {Promise<boolean>} True if both role and menu exist
 */
const isRoleMenuValid = async (roleId, menuId) => {
  const role = await Role.findById(roleId);
  const menu = await Menu.findById(menuId);
  return !!(role && menu);
};

exports.assignMenuToRole = async (req, res) => {
  try {
    const { roleId, menuId } = req.body;

    if (!roleId || !menuId) {
      return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
    }

    const existingLink = await RoleMenu.findOne({ roleId, menuId });
    if (existingLink) {
      return res.status(400).json({ message: ERROR_MESSAGES.MENU_ALREADY_ASSIGNED });
    }

    const isValid = await isRoleMenuValid(roleId, menuId);
    if (!isValid) {
      return res.status(404).json({ message: ERROR_MESSAGES.INVALID_IDS });
    }

    const newAssignment = await RoleMenu.create({ roleId, menuId });

    res.status(201).json({
      message: SUCCESS_MESSAGES.MENU_ASSIGNED,
      assignment: newAssignment
    });
  } catch (error) {
    console.error('Error assigning menu to role:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_ASSIGN });
  }
};

exports.revokeMenuFromRole = async (req, res) => {
  try {
    const { roleId, menuId } = req.params;

    if (!roleId || !menuId) {
      return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_PARAMS });
    }

    // 1. Eliminar el enlace
    const result = await RoleMenu.deleteOne({ roleId, menuId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.ASSIGNMENT_NOT_FOUND });
    }

    res.json({ message: SUCCESS_MESSAGES.MENU_REVOKED });
  } catch (error) {
    console.error('Error revoking menu from role:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_REVOKE });
  }
};

// --- Get Menus Assigned to a Role (Read By Role) ---
// GET /role-menus/:roleId
/**
 * Get all menus assigned to a role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.getMenusByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    // 1. Encontrar todos los enlaces para ese Role
    const roleMenuAssignments = await RoleMenu.find({ roleId }).populate('menuId');

    // 2. Mapear para devolver solo los detalles del menú
    const menus = roleMenuAssignments.map(a => a.menuId).filter(Boolean);

    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus by role:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH });
  }
};