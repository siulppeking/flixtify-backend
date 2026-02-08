/**
 * Role Model
 *
 * Represents role definitions for role-based access control (RBAC).
 * Roles define sets of permissions that can be assigned to users.
 * Each role has a unique name and optional description.
 *
 * @module models/Role
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Field constants for Role schema
 * @type {Object}
 * @property {string} NAME - Role name field key
 * @property {string} DESCRIPTION - Role description field key
 */
const ROLE_FIELDS = {
  NAME: 'name',
  DESCRIPTION: 'description'
};

/**
 * Role schema holds application roles with metadata
 * @typedef {Object} Role
 * @property {string} name - Unique role name (2-50 chars)
 * @property {string} [description] - Role description
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const RoleSchema = new mongoose.Schema(
  {
    [ROLE_FIELDS.NAME]: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50
    },
    [ROLE_FIELDS.DESCRIPTION]: {
      type: String,
      maxlength: 500
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', RoleSchema);