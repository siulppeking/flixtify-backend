const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    // No hay referencias a Menus o Users aquí (totalmente desacoplado)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);