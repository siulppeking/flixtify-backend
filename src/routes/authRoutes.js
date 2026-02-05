// Authentication Routes - User registration, login, token refresh, and 2FA endpoints
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

// Route path constants
const AUTH_ROUTES = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REFRESH: '/refresh',
  SWITCH_ROLE: '/switch-role',
  ENABLE_2FA: '/2fa/enable',
  VERIFY_2FA: '/2fa/verify',
  MENUS: '/menus'
};

const {
  REGISTER,
  LOGIN,
  LOGOUT,
  REFRESH,
  SWITCH_ROLE,
  ENABLE_2FA,
  VERIFY_2FA,
  MENUS
} = AUTH_ROUTES;

/**
 * POST /api/auth/register - User registration
 * @description Register a new user account
 */
router.post(REGISTER, authController.register);

/**
 * POST /api/auth/login - User login
 * @description Authenticate user and return JWT token
 */
router.post(LOGIN, authController.login);

/**
 * POST /api/auth/logout - User logout
 * @description Invalidate user session
 */
router.post(LOGOUT, authController.logout);

/**
 * POST /api/auth/refresh - Refresh JWT token
 * @description Refresh expired JWT token
 */
router.post(REFRESH, authController.refreshToken);

/**
 * POST /api/auth/switch-role - Switch active role
 * @description Switch user's active role (requires authentication)
 */
router.post(SWITCH_ROLE, auth, authController.switchActiveRole);

/**
 * POST /api/auth/2fa/enable - Enable two-factor authentication
 * @description Enable 2FA for user account (requires authentication)
 */
router.post(ENABLE_2FA, auth, authController.enable2FA);

/**
 * POST /api/auth/2fa/verify - Verify two-factor authentication
 * @description Verify 2FA code for login (requires authentication)
 */
router.post(VERIFY_2FA, auth, authController.verify2FA);

/**
 * GET /api/auth/menus - Get user menus
 * @description Get menu items for authenticated user
 */
router.get(MENUS, auth, authController.getMyMenus);

module.exports = router;