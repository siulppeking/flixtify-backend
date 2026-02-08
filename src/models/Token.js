/**
 * Token Model
 *
 * Stores JWT refresh tokens for user authentication sessions.
 * Maintains token metadata including user agent and IP for security tracking.
 * Enables token revocation and session management.
 *
 * @module models/Token
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Field constants for Token schema
 * @type {Object}
 * @property {string} USER_ID - User reference field key
 * @property {string} REFRESH_TOKEN - Refresh token field key
 * @property {string} USER_AGENT - Browser/client information field key
 * @property {string} IP - Client IP address field key
 * @property {string} EXPIRES_AT - Token expiration timestamp field key
 */
const TOKEN_FIELDS = {
  USER_ID: 'userId',
  REFRESH_TOKEN: 'refreshToken',
  USER_AGENT: 'userAgent',
  IP: 'ip',
  EXPIRES_AT: 'expiresAt'
};

/**
 * Token schema stores refresh tokens tied to users with session metadata
 * @typedef {Object} Token
 * @property {ObjectId} userId - Reference to user who owns token
 * @property {string} refreshToken - Encrypted JWT refresh token
 * @property {string} userAgent - Browser/client user agent string
 * @property {string} ip - Client IP address at token creation
 * @property {Date} expiresAt - Token expiration timestamp
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const TokenSchema = new mongoose.Schema(
  {
    [TOKEN_FIELDS.USER_ID]: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    [TOKEN_FIELDS.REFRESH_TOKEN]: {
      type: String,
      required: true,
      unique: true
    },
    [TOKEN_FIELDS.USER_AGENT]: String,
    [TOKEN_FIELDS.IP]: String,
    [TOKEN_FIELDS.EXPIRES_AT]: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

TokenSchema.index({ [TOKEN_FIELDS.EXPIRES_AT]: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Token', TokenSchema);
