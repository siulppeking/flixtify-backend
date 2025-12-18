const mongoose = require('mongoose');

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
      enum: ['menu', 'submenu', 'form'],
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