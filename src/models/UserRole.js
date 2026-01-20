// UserRole Model - Associates users with roles for permission management
const mongoose = require('mongoose');

// Constants for UserRole model
const USER_ROLE_FIELDS = {
  USER_ID: 'userId',
  ROLE_ID: 'roleId',
  IS_ACTIVE: 'isActive'
};

/**
 * UserRole schema links users to roles, with an active flag
 */
const UserRoleSchema = new mongoose.Schema(
  {
    [USER_ROLE_FIELDS.USER_ID]: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    [USER_ROLE_FIELDS.ROLE_ID]: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true
    },
    [USER_ROLE_FIELDS.IS_ACTIVE]: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: [USER_ROLE_FIELDS.USER_ID, USER_ROLE_FIELDS.ROLE_ID] }]
  }
);

module.exports = mongoose.model('UserRole', UserRoleSchema);