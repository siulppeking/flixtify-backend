const mongoose = require('mongoose');

// Constants for RoleMenu model
const ROLE_MENU_FIELDS = {
  ROLE_ID: 'roleId',
  MENU_ID: 'menuId'
};

/**
 * RoleMenu schema links roles with menus
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