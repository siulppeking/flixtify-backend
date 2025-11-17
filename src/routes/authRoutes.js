const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

// --- Auth ---
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);

// --- Gestión de Roles Activos ---
// Nueva ruta para que el usuario cambie su rol activo
router.post("/switch-role", auth, authController.switchActiveRole); 

// --- 2FA ---
router.post("/2fa/enable", auth, authController.enable2FA);
router.post("/2fa/verify", auth, authController.verify2FA);

// --- Menus ---
router.get("/menus", auth, authController.getMyMenus);

module.exports = router;