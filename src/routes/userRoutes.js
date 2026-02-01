// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

// Route path constants
const ROUTE_PATHS = {
  ROOT: '/',
  BY_ID: '/:id'
};

/**
 * POST /api/users - Create new user
 * @description Register a new user account
 */
router.post(ROUTE_PATHS.ROOT, userController.createUser);

/**
 * GET /api/users - Get all users
 * @description Retrieve list of all users (requires authentication)
 */
router.get(ROUTE_PATHS.ROOT, userController.getAllUsers);

/**
 * GET /api/users/:id - Get user by ID
 * @description Retrieve a single user by ID (admin or own profile)
 */
router.get(ROUTE_PATHS.BY_ID, userController.getUserById);

/**
 * PUT /api/users/:id - Update user
 * @description Update user information (admin or own profile)
 */
router.put(ROUTE_PATHS.BY_ID, userController.updateUser);

/**
 * DELETE /api/users/:id - Delete user (soft delete)
 * @description Soft delete a user account (admin or own profile)
 */
router.delete(ROUTE_PATHS.BY_ID, userController.deleteUser);

module.exports = router;