// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false, // No se envía en consultas por defecto
    },
    enabled: { type: Boolean, default: true },
    
    // ✅ 2FA Simplificado
    twoFAEnabled: { // Un método 2FA está activo para el usuario.
        type: Boolean, 
        default: false 
    },
    twoFAVerifiedSession: { // 2FA verificada durante el login actual.
        type: Boolean, 
        default: false
    }, 
    // ----------------------
    
    userPreferences: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "system", required: true },
      fontSize: { type: String, enum: ["sm", "base", "lg", "xl"], default: "base", required: true },
      fontFamily: { type: String, enum: ["sans", "serif", "mono"], default: "sans", required: true },
      colorScheme: { type: String, enum: ["default", "red", "green", "blue", "purple"], default: "default", required: true }
    },
    lastLoginAt: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Pre-save hook para hashear la contraseña
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);