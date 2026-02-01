// Role Menu Routes - Associates menus with roles for access control
const express = require('express');
const router = express.Router();
const roleMenuController = require('../controllers/roleMenuController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

// Route path constants
const ROLE_MENU_ROUTES = {
  ROOT: '/',
  BY_ROLE: '/:roleId',
  BY_ROLE_AND_MENU: '/:roleId/:menuId'
};

/**
 * POST /api/role-menus - Assign menu to role
 * @description Assign a menu to a role (requires authentication and admin privilege)
 */
router.post(ROLE_MENU_ROUTES.ROOT, auth, checkAdmin, roleMenuController.assignMenuToRole);

/**
 * GET /api/role-menus/:roleId - Get menus by role
 * @description Retrieve all menus assigned to a role (requires authentication)
 */
router.get(ROLE_MENU_ROUTES.BY_ROLE, auth, roleMenuController.getMenusByRole);

/**
 * DELETE /api/role-menus/:roleId/:menuId - Revoke menu from role
 * @description Remove a menu from a role (requires authentication and admin privilege)
 */
router.delete(ROLE_MENU_ROUTES.BY_ROLE_AND_MENU, auth, checkAdmin, roleMenuController.revokeMenuFromRole);

module.exports = router;