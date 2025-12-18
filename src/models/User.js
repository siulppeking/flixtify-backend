const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      fontSize: {
        type: String,
        enum: ['sm', 'base', 'lg', 'xl'],
        default: 'base'
      },
      fontFamily: {
        type: String,
        enum: ['sans', 'serif', 'mono'],
        default: 'sans'
      },
      colorScheme: {
        type: String,
        enum: ['default', 'red', 'green', 'blue', 'purple'],
        default: 'default'
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
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);