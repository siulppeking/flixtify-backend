const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: String,
    path: { type: String, required: true, unique: true }, // Ruta del frontend
    // CLAVE: Clasificación de tipos para la jerarquía del frontend
    type: { type: String, enum: ['menu', 'submenu', 'form'], required: true }, 
    // Referencia al padre para construir el árbol de navegación
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", default: null } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", MenuSchema);