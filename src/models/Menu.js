/**
 * Menu Model
 *
 * Represents dynamic menu items for application navigation.
 * Menus can be organized hierarchically as menus, submenus, or form entries.
 * This allows flexible navigation structures based on user roles and permissions.
 *
 * @module models/Menu
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Valid menu item types
 * @type {string[]}
 */
const MENU_TYPES = ['menu', 'submenu', 'form'];

/**
 * Menu schema for navigation structure
 * @typedef {Object} Menu
 * @property {string} name - Menu item name (2-100 chars)
 * @property {string} [icon] - Icon class or identifier (max 50 chars)
 * @property {string} path - Navigation path or route URL
 * @property {string} type - Menu type (menu, submenu, form)
 * @property {ObjectId} [parentId] - Parent menu item reference for hierarchy
 * @property {number} [order] - Display order within parent menu
 * @property {boolean} [visible] - Menu visibility flag
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100
    },
    icon: {
      type: String,
      maxlength: 50
    },
    path: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    type: {
      type: String,
      enum: MENU_TYPES,
      required: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', MenuSchema);