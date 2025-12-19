const mongoose = require('mongoose');

const RoleMenuSchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true
    }
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: ['roleId', 'menuId'] }]
  }
);

module.exports = mongoose.model('RoleMenu', RoleMenuSchema);