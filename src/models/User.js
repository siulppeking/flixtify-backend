const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Constants for model defaults and enums
const BCRYPT_SALT_ROUNDS = 10;

const THEME_ENUM = ['light', 'dark', 'system'];
const THEME_DEFAULT = 'system';

const FONT_SIZE_ENUM = ['sm', 'base', 'lg', 'xl'];
const FONT_SIZE_DEFAULT = 'base';

const FONT_FAMILY_ENUM = ['sans', 'serif', 'mono'];
const FONT_FAMILY_DEFAULT = 'sans';

const COLOR_SCHEME_ENUM = ['default', 'red', 'green', 'blue', 'purple'];
const COLOR_SCHEME_DEFAULT = 'default';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    enabled: {
      type: Boolean,
      default: true
    },
    twoFAEnabled: {
      type: Boolean,
      default: false
    },
    twoFAVerifiedSession: {
      type: Boolean,
      default: false
    },
    userPreferences: {
      theme: {
        type: String,
        enum: THEME_ENUM,
        default: THEME_DEFAULT
      },
      fontSize: {
        type: String,
        enum: FONT_SIZE_ENUM,
        default: FONT_SIZE_DEFAULT
      },
      fontFamily: {
        type: String,
        enum: FONT_FAMILY_ENUM,
        default: FONT_FAMILY_DEFAULT
      },
      colorScheme: {
        type: String,
        enum: COLOR_SCHEME_ENUM,
        default: COLOR_SCHEME_DEFAULT
      }
    },
    lastLoginAt: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);