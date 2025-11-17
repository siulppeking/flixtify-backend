const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true }, // Permite nulo, pero si existe, debe ser único
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Debe ser hasheada con bcrypt
    enabled: { type: Boolean, default: true },
    twoFA: {
      enabled: { type: Boolean, default: false }, // 2FA habilitada por el usuario
      secret: { type: String, default: null }, // Secreto TOTP de speakeasy
      verified: { type: Boolean, default: false } // 2FA verificada durante el login (sesión)
    },
    lastLoginAt: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);