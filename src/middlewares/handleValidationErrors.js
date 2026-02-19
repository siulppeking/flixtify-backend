/**
 * Validation Error Handler Middleware
 * Catches and formats validation errors from express-validator
 * Provides consistent error response formatting across API
 */
const { validationResult } = require('express-validator');

// Validation response configuration
const VALIDATION_CONFIG = {
  ERROR_STATUS_CODE: 400,
  ERROR_MESSAGE: 'Validation failed'
};

// Constants for validation response
const VALIDATION_RESPONSE = {
  STATUS: VALIDATION_CONFIG.ERROR_STATUS_CODE,
  MESSAGE: VALIDATION_CONFIG.ERROR_MESSAGE
};

/**
 * Middleware to handle validation errors from express-validator
 * Extracts validation errors and returns them in a consistent format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array();
    return res.status(VALIDATION_RESPONSE.STATUS).json({
      status: VALIDATION_RESPONSE.STATUS,
      message: VALIDATION_RESPONSE.MESSAGE,
      errors: validationErrors
    });
  }

  next();
};

module.exports = handleValidationErrors;