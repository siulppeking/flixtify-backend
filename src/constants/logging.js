/**
 * Logging Configuration Constants
 * Centralized logging levels, formats, and messages
 */

module.exports = {
  // Log levels
  LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
    TRACE: 'trace'
  },

  // Log messages for common operations
  MESSAGES: {
    // Database operations
    DB_CONNECTED: '✅ MongoDB connection successful',
    DB_DISCONNECTED: '⚠️ MongoDB disconnected',
    DB_CONNECTION_ERROR: '❌ MongoDB connection error',

    // Server operations
    SERVER_STARTED: '🚀 Server running on port',
    SERVER_STOPPING: '🛑 Server stopping...',
    SERVER_ERROR: '❌ Internal server error',

    // Authentication
    AUTH_LOGIN_ATTEMPT: 'Login attempt',
    AUTH_LOGIN_SUCCESS: '✅ User logged in successfully',
    AUTH_LOGIN_FAILED: '❌ Login failed',
    AUTH_TOKEN_INVALID: 'Invalid token attempt',
    AUTH_PERMISSION_DENIED: '🔐 Permission denied',

    // Resource operations
    RESOURCE_CREATED: 'Resource created',
    RESOURCE_UPDATED: 'Resource updated',
    RESOURCE_DELETED: 'Resource deleted',
    RESOURCE_NOT_FOUND: 'Resource not found',
    RESOURCE_ACCESS_DENIED: 'Resource access denied',

    // Validation
    VALIDATION_FAILED: 'Validation failed',
    VALIDATION_SUCCESS: 'Validation successful',

    // API responses
    API_REQUEST: 'API Request',
    API_RESPONSE: 'API Response',
    API_ERROR: 'API Error'
  },

  // Error logging templates
  ERROR_TEMPLATES: {
    OPERATION_FAILED: (operation, details) => `${operation} failed: ${details}`,
    RESOURCE_ERROR: (operation, resource) => `Error ${operation} ${resource}`,
    DATABASE_ERROR: (operation) => `Database ${operation} error`,
    VALIDATION_ERROR: (field) => `Validation error on field: ${field}`
  },

  // Success logging templates
  SUCCESS_TEMPLATES: {
    OPERATION_COMPLETED: (operation) => `${operation} completed successfully`,
    RESOURCE_CREATED: (resource) => `${resource} created successfully`,
    RESOURCE_UPDATED: (resource) => `${resource} updated successfully`,
    RESOURCE_DELETED: (resource) => `${resource} deleted successfully`
  },

  // Log format
  FORMAT: 'dev',

  // Console colors for logs (for improved visibility)
  COLORS: {
    ERROR: '\x1b[31m',    // Red
    WARN: '\x1b[33m',     // Yellow
    SUCCESS: '\x1b[32m',  // Green
    INFO: '\x1b[36m',     // Cyan
    RESET: '\x1b[0m'      // Reset
  }
};
