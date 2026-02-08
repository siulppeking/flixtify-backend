/**
 * UserRole Model
 *
 * Associates users with roles for permission management.
 * Implements the core of role-based access control (RBAC).
 * Supports multiple roles per user with activation status.
 *
 * @module models/UserRole
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Field constants for UserRole schema
 * @type {Object}
 * @property {string} USER_ID - User reference field key
 * @property {string} ROLE_ID - Role reference field key
 * @property {string} IS_ACTIVE - Active status field key
 */
const USER_ROLE_FIELDS = {
  USER_ID: 'userId',
  ROLE_ID: 'roleId',
  IS_ACTIVE: 'isActive'
};

/**
 * UserRole schema links users to roles with activation status for RBAC
 * @typedef {Object} UserRole
 * @property {ObjectId} userId - Reference to user
 * @property {ObjectId} roleId - Reference to role
 * @property {boolean} isActive - Whether this role assignment is active
 * @property {Date} assignedAt - When role was assigned
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
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