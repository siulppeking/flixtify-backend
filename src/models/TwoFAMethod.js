// models/TwoFAMethod.js
const mongoose = require("mongoose");

// Constants for TwoFAMethod model
const TWO_FA_FIELDS = {
    USER_ID: 'userId',
    METHOD_TYPE: 'methodType',
    SECRET: 'secret',
    IS_ENABLED: 'isEnabled',
    IS_VERIFIED: 'isVerified',
    IS_PRIMARY: 'isPrimary',
    DELETED: 'deleted'
};

const TWO_FA_METHOD_TYPES = ["TOTP", "SMS", "EMAIL"];

/**
 * TwoFAMethod schema stores 2FA methods per user
 */
const TwoFAMethodSchema = new mongoose.Schema(
    {
        [TWO_FA_FIELDS.USER_ID]: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        [TWO_FA_FIELDS.METHOD_TYPE]: {
            type: String,
            enum: TWO_FA_METHOD_TYPES,
            required: true
        },
        [TWO_FA_FIELDS.SECRET]: {
            type: String,
            required: function () {
                return this.methodType === 'TOTP';
            }
        }, // Secreto TOTP o número de teléfono/email
        [TWO_FA_FIELDS.IS_ENABLED]: {
            type: Boolean,
            default: false
        }, // Si está activo actualmente
        [TWO_FA_FIELDS.IS_VERIFIED]: {
            type: Boolean,
            default: false
        }, // Si el usuario lo ha verificado (para configuración inicial)
        [TWO_FA_FIELDS.IS_PRIMARY]: {
            type: Boolean,
            default: false
        }, // Útil si necesitas un fallback o método principal
        [TWO_FA_FIELDS.DELETED]: {
            type: Boolean,
            default: false
        } // Soft delete del método
    },
    { timestamps: true }
);

// Asegura que no haya dos métodos primarios activos y no eliminados
TwoFAMethodSchema.index({ [TWO_FA_FIELDS.USER_ID]: 1, [TWO_FA_FIELDS.IS_PRIMARY]: 1, [TWO_FA_FIELDS.DELETED]: 1 }, { unique: true, partialFilterExpression: { isPrimary: true, deleted: false } });

module.exports = mongoose.model("TwoFAMethod", TwoFAMethodSchema);