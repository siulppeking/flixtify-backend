/**
 * HTTP Status Code Constants
 * Standard REST API status codes organized by category
 * 2xx: Success | 4xx: Client Error | 5xx: Server Error
 */

module.exports = {
  // Success responses - 2xx
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
