// Token Model - Stores JWT refresh tokens for user authentication sessions
const mongoose = require('mongoose');

// Constants for Token model
const TOKEN_FIELDS = {
  USER_ID: 'userId',
  REFRESH_TOKEN: 'refreshToken',
  USER_AGENT: 'userAgent',
  IP: 'ip',
  EXPIRES_AT: 'expiresAt'
};

/**
 * Token schema stores refresh tokens tied to users
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
