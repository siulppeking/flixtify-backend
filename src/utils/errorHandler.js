/**
 * Error Handler Utility
 * Centralized error handling and response formatting
 */

const httpStatus = require('../constants/httpStatus');
const errorMessages = require('../constants/errorMessages');

/**
 * Handle database duplicate key error (E11000)
 * @param {Error} error - MongoDB duplicate key error
 * @returns {Object} Formatted error response
 */
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  return {
    status: httpStatus.CONFLICT,
    message: `${field} already exists`,
    field
  };
};

/**
 * Handle database validation error
 * @param {Error} error - Mongoose validation error
 * @returns {Object} Formatted error response
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => ({
    field: err.path,
    message: err.message
  }));

  return {
    status: httpStatus.BAD_REQUEST,
    message: 'Validation error',
    errors
  };
};

/**
 * Handle cast error (invalid ObjectId)
 * @returns {Object} Formatted error response
 */
const handleCastError = () => {
  return {
    status: httpStatus.BAD_REQUEST,
    message: 'Invalid resource ID format'
  };
};

/**
 * Generic error handler for controllers
 * @param {Error} error - Error object
 * @param {string} context - Operation context for logging
 * @returns {Object} Formatted error response
 */
const handleControllerError = (error, context = 'Operation') => {
  console.error(`${context} error:`, error);

  // Specific error handling
  if (error.code === 11000) {
    return handleDuplicateKeyError(error);
  }

  if (error.name === 'ValidationError') {
    return handleValidationError(error);
  }

  if (error.name === 'CastError') {
    return handleCastError();
  }

  // Default server error
  return {
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: errorMessages.SERVER_ERROR
  };
};

/**
 * Send error response with consistent format
 * @param {Object} res - Express response object
 * @param {Object} errorObj - Error object with status, message, and optional errors
 * @returns {void}
 */
const sendErrorResponse = (res, errorObj) => {
  const { status, message, ...rest } = errorObj;

  return res.status(status).json({
    status,
    message,
    timestamp: new Date().toISOString(),
    ...rest
  });
};

/**
 * Send not found error response
 * @param {Object} res - Express response object
 * @param {string} resourceName - Name of the resource
 * @returns {void}
 */
const sendNotFoundError = (res, resourceName = 'Resource') => {
  return sendErrorResponse(res, {
    status: httpStatus.NOT_FOUND,
    message: `${resourceName} not found`
  });
};

/**
 * Send unauthorized error response
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 * @returns {void}
 */
const sendUnauthorizedError = (res, message = errorMessages.UNAUTHORIZED) => {
  return sendErrorResponse(res, {
    status: httpStatus.UNAUTHORIZED,
    message
  });
};

/**
 * Send forbidden error response
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 * @returns {void}
 */
const sendForbiddenError = (res, message = errorMessages.ACCESS_DENIED) => {
  return sendErrorResponse(res, {
    status: httpStatus.FORBIDDEN,
    message
  });
};

module.exports = {
  handleDuplicateKeyError,
  handleValidationError,
  handleCastError,
  handleControllerError,
  sendErrorResponse,
  sendNotFoundError,
  sendUnauthorizedError,
  sendForbiddenError
};
