const UserRole = require('../models/UserRole');
const Role = require('../models/Role');

// Constants
const ADMIN_ROLE_NAME = 'ADMIN';

const AUTH_ERRORS = {
  NO_ACTIVE_ROLE: 'Access denied: No active role found',
  ROLE_NOT_RECOGNIZED: 'Access denied: Role not recognized',
  REQUIRES_ADMIN: 'Access denied: Requires ADMIN privileges',
  VERIFICATION_FAILED: 'Authorization verification failed'
};

/**
 * Middleware to verify that the user has ADMIN role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const checkAdmin = async (req, res, next) => {
  try {
    const activeRoleId = req.user.activeRoleId;

    if (!activeRoleId) {
      return res.status(403).json({ message: AUTH_ERRORS.NO_ACTIVE_ROLE });
    }

    // Verify active role is ADMIN
    const activeRole = await Role.findById(activeRoleId);

    if (!activeRole) {
      return res.status(403).json({ message: AUTH_ERRORS.ROLE_NOT_RECOGNIZED });
    }

    if (activeRole.name !== ADMIN_ROLE_NAME) {
      return res.status(403).json({ message: AUTH_ERRORS.REQUIRES_ADMIN });
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ message: AUTH_ERRORS.VERIFICATION_FAILED });
  }
};

module.exports = checkAdmin;