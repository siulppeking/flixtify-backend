// Admin Check Middleware - Verifies user has admin role for protected routes
const Role = require('../models/Role');
const errorMessages = require('../constants/errorMessages');
const httpStatus = require('../constants/httpStatus');

// Constants for admin verification
const ADMIN_VERIFICATION_CONFIG = {
  ADMIN_ROLE_NAME: 'ADMIN',
  ERROR_LOG_PREFIX: 'Authorization error:'
};

/**
 * Middleware to verify that the user has ADMIN role
 * Checks if the user's active role is set to ADMIN level
 * @param {Object} req - Express request object with user info
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if admin, sends 403 error otherwise
 */
const checkAdmin = async (req, res, next) => {
  try {
    const activeRoleId = req.user.activeRoleId;

    if (!activeRoleId) {
      return res.status(httpStatus.FORBIDDEN).json({ message: errorMessages.NO_ACTIVE_ROLE });
    }

    // Verify active role is ADMIN
    const activeRole = await Role.findById(activeRoleId);

    if (!activeRole) {
      return res.status(httpStatus.FORBIDDEN).json({ message: errorMessages.ROLE_NOT_RECOGNIZED });
    }

    if (activeRole.name !== ADMIN_VERIFICATION_CONFIG.ADMIN_ROLE_NAME) {
      return res.status(httpStatus.FORBIDDEN).json({ message: errorMessages.REQUIRES_ADMIN });
    }

    next();
  } catch (error) {
    console.error(ADMIN_VERIFICATION_CONFIG.ERROR_LOG_PREFIX, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: errorMessages.AUTHORIZATION_VERIFICATION_FAILED });
  }
};

module.exports = checkAdmin;