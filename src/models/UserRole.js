const mongoose = require("mongoose");

const UserRoleSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
        // CLAVE: Solo un registro por userId puede ser 'true'. 
        // Esto define el rol que el usuario está utilizando en la sesión actual.
        isActive: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        // Agregamos un índice compuesto para asegurar que un usuario no tenga el mismo rol dos veces
        // y que la búsqueda por usuario y rol sea eficiente.
        indexes: [{ unique: true, fields: ['userId', 'roleId'] }]
    }
);

module.exports = mongoose.model("UserRole", UserRoleSchema);