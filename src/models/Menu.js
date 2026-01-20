// Menu Model - Represents dynamic menu items for application navigation
const mongoose = require('mongoose');

// Constants for Menu model types
const MENU_TYPES = ['menu', 'submenu', 'form'];

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