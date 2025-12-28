const mongoose = require('mongoose');

// Constants for Menu model types
const MENU_TYPES = ['menu', 'submenu', 'form'];

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    icon: String,
    path: {
      type: String,
      required: true,
      unique: true
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