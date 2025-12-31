const UserRole = require('../models/UserRole');
const Role = require('../models/Role');
const httpStatus = require('../constants/httpStatus');
const errorMessages = require('../constants/errorMessages');

// Constants
const ADMIN_ROLE_NAME = 'ADMIN';

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
      return res.status(httpStatus.FORBIDDEN).json({ message: errorMessages.NO_ACTIVE_ROLE });
    }

    // Verify active role is ADMIN
    const activeRole = await Role.findById(activeRoleId);

    if (!activeRole) {
      return res.status(httpStatus.FORBIDDEN).json({ message: errorMessages.ROLE_NOT_RECOGNIZED });
    }

    if (activeRole.name !== ADMIN_ROLE_NAME) {
      return res.status(httpStatus.FORBIDDEN).json({ message: errorMessages.REQUIRES_ADMIN });
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: errorMessages.AUTHORIZATION_VERIFICATION_FAILED });
  }
};

module.exports = checkAdmin;