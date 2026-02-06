// Role Routes - CRUD operations for managing roles and permissions
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

// Route path constants
const ROLE_ROUTES = {
  ROOT: '/',
  BY_ID: '/:id'
};

const { ROOT, BY_ID } = ROLE_ROUTES;

/**
 * GET /api/roles - Get all roles
 * @description Retrieve all roles (requires authentication and admin privilege)
 */
router.get(ROOT, auth, checkAdmin, roleController.getAllRoles);

/**
 * POST /api/roles - Create new role
 * @description Create a new role (requires authentication and admin privilege)
 */
router.post(ROOT, auth, checkAdmin, roleController.createRole);

/**
 * GET /api/roles/:id - Get role by ID
 * @description Retrieve a single role by ID (requires authentication)
 */
router.get(BY_ID, auth, roleController.getRoleById);

/**
 * PUT /api/roles/:id - Update role
 * @description Update role information (requires authentication and admin privilege)
 */
router.put(BY_ID, auth, checkAdmin, roleController.updateRole);

/**
 * DELETE /api/roles/:id - Delete role
 * @description Delete a role (requires authentication and admin privilege)
 */
router.delete(BY_ID, auth, checkAdmin, roleController.deleteRole);

module.exports = router;