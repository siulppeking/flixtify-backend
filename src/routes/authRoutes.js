const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);

// Role management
router.post('/switch-role', auth, authController.switchActiveRole);

// Two-factor authentication
router.post('/2fa/enable', auth, authController.enable2FA);
router.post('/2fa/verify', auth, authController.verify2FA);

// Menu routes
router.get('/menus', auth, authController.getMyMenus);

module.exports = router;