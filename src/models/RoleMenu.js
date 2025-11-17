const mongoose = require("mongoose");

const RoleMenuSchema = new mongoose.Schema(
  {
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true }
  },
  { 
    timestamps: true,
    // Índice compuesto para asegurar que un rol no tenga el mismo menú dos veces.
    indexes: [{ unique: true, fields: ['roleId', 'menuId'] }] 
  }
);

module.exports = mongoose.model("RoleMenu", RoleMenuSchema);