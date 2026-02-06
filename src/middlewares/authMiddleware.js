// Authentication Middleware - Validates JWT tokens and extracts user information
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpStatus = require('../constants/httpStatus');
const errorMessages = require('../constants/errorMessages');

// Constants for token validation
const TOKEN_PREFIX = 'Bearer';
const BEARER_SPLIT_INDEX = 1;

/**
 * Extract bearer token from authorization header
 * @param {string} authHeader - The authorization header value
 * @returns {string|null} The token if valid format, null otherwise
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts[0] !== TOKEN_PREFIX || parts.length !== 2) return null;
  return parts[BEARER_SPLIT_INDEX];
};

/**
 * Verify and decode JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} Decoded token payload if valid, null otherwise
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to authenticate requests using JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const auth = async (req, res, next) => {
  try {
    const { authorization: authHeader } = req.headers;
    if (!authHeader) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: errorMessages.MISSING_AUTHORIZATION_HEADER });
    }

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: errorMessages.MISSING_TOKEN });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: errorMessages.INVALID_TOKEN });
    }

    const { id, activeRoleId } = decoded;

    const user = await User.findById(id);
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: errorMessages.USER_NOT_FOUND });
    }
    if (!user.enabled) {
      return res.status(httpStatus.FORBIDDEN).json({ message: errorMessages.USER_DISABLED });
    }

    req.user = {
      id: user._id,
      activeRoleId
    };

    next();
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).json({ message: errorMessages.INVALID_TOKEN });
  }
};

module.exports = auth;