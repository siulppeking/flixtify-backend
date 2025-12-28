const { validationResult } = require('express-validator');

// Constants for validation response
const VALIDATION_RESPONSE = {
  STATUS: 400,
  MESSAGE: 'Validation failed'
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
    return res.status(VALIDATION_RESPONSE.STATUS).json({
      status: VALIDATION_RESPONSE.STATUS,
      message: VALIDATION_RESPONSE.MESSAGE,
      errors: errors.array()
    });
  }

  next();
};

module.exports = handleValidationErrors;