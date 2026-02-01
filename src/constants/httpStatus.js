/**
 * HTTP Status Code Constants
 * Centralized definitions for all HTTP status codes used across the API
 * Standard codes: 2xx (success), 4xx (client error), 5xx (server error)
 */

module.exports = {
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};
