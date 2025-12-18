// models/TwoFAMethod.js
const mongoose = require("mongoose");

const TwoFAMethodSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        methodType: {
            type: String,
            enum: ["TOTP", "SMS", "EMAIL"],
            required: true
        },
        secret: {
            type: String,
            required: function () {
                return this.methodType === 'TOTP';
            }
        }, // Secreto TOTP o número de teléfono/email
        isEnabled: {
            type: Boolean,
            default: false
        }, // Si está activo actualmente
        isVerified: {
            type: Boolean,
            default: false
        }, // Si el usuario lo ha verificado (para configuración inicial)
        isPrimary: {
            type: Boolean,
            default: false
        }, // Útil si necesitas un fallback o método principal
        deleted: {
            type: Boolean,
            default: false
        } // Soft delete del método
    },
    { timestamps: true }
);

// Asegura que no haya dos métodos primarios activos y no eliminados
TwoFAMethodSchema.index({ userId: 1, isPrimary: 1, deleted: 1 }, { unique: true, partialFilterExpression: { isPrimary: true, deleted: false } });

module.exports = mongoose.model("TwoFAMethod", TwoFAMethodSchema);