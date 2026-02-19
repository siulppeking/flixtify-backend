/**
 * Validation Error Formatter Utility
 * Standardizes validation error response formatting across the API
 * Provides consistent error structure and messaging for validation failures
 */

// Format validation errors into consistent response structure

const httpStatus = require('../constants/httpStatus');

// Validation error response configuration
const VALIDATION_ERROR_CONFIG = {
  ERROR_STATUS: 400,
  ERROR_MESSAGE: 'Validation failed',
  ERROR_TIMESTAMP_FORMAT: 'ISO'
};

/**
 * Format validation errors from express-validator
 * @param {Array<Object>} errors - Array of error objects from validationResult
 * @returns {Object} Formatted error response object
 */
const formatValidationErrors = (errors) => {
  const errorMap = {};
  
  errors.forEach(error => {
    if (error.param) {
      if (!errorMap[error.param]) {
        errorMap[error.param] = [];
      }
      errorMap[error.param].push(error.msg);
    }
  });

  return {
    status: httpStatus.BAD_REQUEST,
    message: 'Validation failed',
    errors: errorMap,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format single validation error
 * @param {string} field - Field name that failed validation
 * @param {string} message - Error message
 * @returns {Object} Formatted error response object
 */
const formatSingleError = (field, message) => {
  return {
    status: httpStatus.BAD_REQUEST,
    message: 'Validation failed',
    errors: {
      [field]: [message]
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Check if value meets minimum length requirement
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum required length
 * @returns {boolean} True if valid, false otherwise
 */
const isValidLength = (value, minLength) => {
  return value && value.trim().length >= minLength;
};

/**
 * Check if email format is valid
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format, false otherwise
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  formatValidationErrors,
  formatSingleError,
  isValidLength,
  isValidEmail
};
