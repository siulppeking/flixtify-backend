// User Role Routes - Manages user-role assignments and relationships
const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

// Route path constants
const USER_ROLE_ROUTES = {
  ROOT: '/',
  BY_USER: '/:userId',
  BY_USER_AND_ROLE: '/:userId/:roleId'
};

/**
 * POST /api/user-roles - Assign role to user
 * @description Assign a role to a user (requires authentication and admin privilege)
 */
router.post(USER_ROLE_ROUTES.ROOT, auth, checkAdmin, userRoleController.assignRoleToUser);

/**
 * GET /api/user-roles/:userId - Get roles by user
 * @description Retrieve all roles assigned to a user (requires authentication)
 */
router.get(USER_ROLE_ROUTES.BY_USER, auth, userRoleController.getRolesByUser);

/**
 * DELETE /api/user-roles/:userId/:roleId - Revoke role from user
 * @description Remove a role from a user (requires authentication and admin privilege)
 */
router.delete(USER_ROLE_ROUTES.BY_USER_AND_ROLE, auth, checkAdmin, userRoleController.revokeRoleFromUser);

module.exports = router;