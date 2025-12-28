const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Constants for token validation
const AUTH_ERRORS = {
  MISSING_HEADER: 'Authorization header missing',
  MISSING_TOKEN: 'Token missing',
  INVALID_TOKEN: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
  USER_DISABLED: 'User disabled'
};

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
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: AUTH_ERRORS.MISSING_HEADER });
    }

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return res.status(401).json({ message: AUTH_ERRORS.MISSING_TOKEN });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: AUTH_ERRORS.INVALID_TOKEN });
    }

    const { id, activeRoleId } = decoded;

    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: AUTH_ERRORS.USER_NOT_FOUND });
    }
    if (!user.enabled) {
      return res.status(403).json({ message: AUTH_ERRORS.USER_DISABLED });
    }

    req.user = {
      id: user._id,
      activeRoleId
    };

    next();
  } catch (error) {
    res.status(401).json({ message: AUTH_ERRORS.INVALID_TOKEN });
  }
};

module.exports = auth;