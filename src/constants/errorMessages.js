/**
 * Error Messages Constants
 * Centralized definitions for all common error messages across the API
 */

module.exports = {
  // Authentication errors
  MISSING_AUTHORIZATION_HEADER: 'Authorization header missing',
  MISSING_TOKEN: 'Token missing',
  INVALID_TOKEN: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
  USER_DISABLED: 'User disabled',
  INVALID_CREDENTIALS: 'Invalid email or password',
  
  // Authorization errors
  NO_ACTIVE_ROLE: 'Access denied: No active role found',
  ROLE_NOT_RECOGNIZED: 'Access denied: Role not recognized',
  REQUIRES_ADMIN: 'Access denied: Requires ADMIN privileges',
  AUTHORIZATION_VERIFICATION_FAILED: 'Authorization verification failed',
  ACCESS_DENIED: 'Access denied',
  
  // User errors
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IN_USE: 'Username or email already in use',
  USER_NOT_FOUND_OR_DELETED: 'User not found or deleted',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  
  // Server errors
  SERVER_ERROR: 'Server error',
  SERVER_ERROR_CREATING_USER: 'Server error creating user',
  SERVER_ERROR_FETCHING_USER: 'Server error fetching user',
  SERVER_ERROR_FETCHING_USERS: 'Server error fetching users',
  DATABASE_CONNECTION_ERROR: 'Database connection error',
  
  // Validation errors
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  INVALID_DATE_FORMAT: 'Invalid date format (YYYY-MM-DD)',
  MINIMUM_LENGTH_REQUIRED: (length) => `Minimum ${length} characters required`,
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'Resource not found',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists'
};
