/**
 * Environment Configuration Constants
 * Centralized environment variables with defaults and validation
 * Manages all configuration settings from .env and defaults
 */

module.exports = {
  // Server configuration
  SERVER: {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || 'localhost'
  },

  // Database configuration
  DATABASE: {
    URL: process.env.URL_MONGODB || 'mongodb://localhost:27017/flixtify',
    CONNECTION_TIMEOUT: 30000,
    MAX_RETRIES: 3
  },

  // JWT configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d'
  },

  // CORS configuration
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    CREDENTIALS: true
  },

  // Logging configuration
  LOGGING: {
    LEVEL: process.env.LOG_LEVEL || 'info',
    FORMAT: 'dev'
  },

  // API configuration
  API: {
    VERSION: 'v1',
    BASE_PATH: '/api/v1'
  },

  // Validation configuration
  VALIDATION: {
    MAX_REQUEST_SIZE: '10mb',
    MAX_JSON_SIZE: '10mb'
  }
};
