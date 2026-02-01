// Menu Routes - Endpoints for managing dynamic menu items
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

// Route path constants
const MENU_ROUTES = {
  ROOT: '/',
  BY_ID: '/:id'
};

/**
 * GET /api/menus - Get all menus
 * @description Retrieve all menu items (requires authentication)
 */
router.get(MENU_ROUTES.ROOT, auth, menuController.getAllMenus);

/**
 * POST /api/menus - Create new menu
 * @description Create a new menu item (requires authentication and admin privilege)
 */
router.post(MENU_ROUTES.ROOT, auth, checkAdmin, menuController.createMenu);

/**
 * GET /api/menus/:id - Get menu by ID
 * @description Retrieve a single menu by ID (requires authentication)
 */
router.get(MENU_ROUTES.BY_ID, auth, menuController.getMenuById);

/**
 * PUT /api/menus/:id - Update menu
 * @description Update menu information (requires authentication and admin privilege)
 */
router.put(MENU_ROUTES.BY_ID, auth, checkAdmin, menuController.updateMenu);

/**
 * DELETE /api/menus/:id - Delete menu
 * @description Delete a menu item (requires authentication and admin privilege)
 */
router.delete(MENU_ROUTES.BY_ID, auth, checkAdmin, menuController.deleteMenu);

module.exports = router;