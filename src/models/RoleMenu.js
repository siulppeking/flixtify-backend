/**
 * RoleMenu Model
 *
 * Maps menu items to roles for role-based menu visibility.
 * Implements a many-to-many relationship between roles and menus.
 * Determines which menu items are accessible to users of each role.
 *
 * @module models/RoleMenu
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Field constants for RoleMenu schema
 * @type {Object}
 * @property {string} ROLE_ID - Role reference field key
 * @property {string} MENU_ID - Menu reference field key
 */
const ROLE_MENU_FIELDS = {
  ROLE_ID: 'roleId',
  MENU_ID: 'menuId'
};

/**
 * RoleMenu schema creates many-to-many relationship between roles and menus
 * @typedef {Object} RoleMenu
 * @property {ObjectId} roleId - Reference to role
 * @property {ObjectId} menuId - Reference to menu item
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const RoleMenuSchema = new mongoose.Schema(
  {
    [ROLE_MENU_FIELDS.ROLE_ID]: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    [ROLE_MENU_FIELDS.MENU_ID]: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true
    }
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: [ROLE_MENU_FIELDS.ROLE_ID, ROLE_MENU_FIELDS.MENU_ID] }]
  }
);

module.exports = mongoose.model('RoleMenu', RoleMenuSchema);