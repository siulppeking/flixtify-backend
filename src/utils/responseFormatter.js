/**
 * Response Formatter Utility
 * Standardizes API response formatting across all endpoints
 */

// Helper functions for consistent HTTP response formatting

const httpStatus = require('../constants/httpStatus');

/**
 * Format success response
 * @param {Object} data - Response data payload
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Formatted success response
 */
const successResponse = (data, message = 'Success', statusCode = httpStatus.OK) => {
  return {
    status: statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} errors - Additional error details (optional)
 * @returns {Object} Formatted error response
 */
const errorResponse = (message, statusCode = httpStatus.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    status: statusCode,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
};

/**
 * Format paginated response
 * @param {Array<Object>} data - Array of data items
 * @param {number} total - Total count of items (not paginated)
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {string} message - Success message
 * @returns {Object} Formatted paginated response
 */
const paginatedResponse = (data, total, page, limit, message = 'Success') => {
  return {
    status: httpStatus.OK,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Format created resource response
 * @param {Object} resource - Created resource object
 * @param {string} message - Success message
 * @returns {Object} Formatted creation response
 */
const createdResponse = (resource, message = 'Resource created successfully') => {
  return successResponse(resource, message, httpStatus.CREATED);
};

/**
 * Format deleted resource response
 * @param {string} message - Success message
 * @returns {Object} Formatted deletion response
 */
const deletedResponse = (message = 'Resource deleted successfully') => {
  return {
    status: httpStatus.OK,
    message,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  deletedResponse
};
