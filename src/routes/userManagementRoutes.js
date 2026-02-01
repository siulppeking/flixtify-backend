// User Management Routes - Admin endpoints for user CRUD operations
const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/userManagementController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

// Route path constants
const USER_MGMT_ROUTES = {
  ROOT: '/',
  BY_ID: '/:id'
};

/**
 * GET /api/user-management - Get all users
 * @description Retrieve all users (requires authentication and admin privilege)
 */
router.get(USER_MGMT_ROUTES.ROOT, auth, checkAdmin, userManagementController.getAllUsers);

/**
 * GET /api/user-management/:id - Get user by ID
 * @description Retrieve a single user by ID (requires authentication and admin privilege)
 */
router.get(USER_MGMT_ROUTES.BY_ID, auth, checkAdmin, userManagementController.getUserById);

/**
 * PUT /api/user-management/:id - Update user
 * @description Update user information (requires authentication and admin privilege)
 */
router.put(USER_MGMT_ROUTES.BY_ID, auth, checkAdmin, userManagementController.updateUser);

/**
 * DELETE /api/user-management/:id - Delete user
 * @description Delete a user account (requires authentication and admin privilege)
 */
router.delete(USER_MGMT_ROUTES.BY_ID, auth, checkAdmin, userManagementController.deleteUser);

module.exports = router;