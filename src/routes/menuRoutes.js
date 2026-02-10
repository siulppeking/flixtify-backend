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

const { ROOT, BY_ID } = MENU_ROUTES;

/**
 * GET /api/menus - Get all menus
 * @description Retrieve all menu items (requires authentication)
 */
router.get(ROOT, auth, menuController.getAllMenus);

/**
 * POST /api/menus - Create new menu
 * @description Create a new menu item (requires authentication and admin privilege)
 */
router.post(ROOT, auth, checkAdmin, menuController.createMenu);

/**
 * GET /api/menus/:id - Get menu by ID
 * @description Retrieve a single menu by ID (requires authentication)
 */
router.get(BY_ID, auth, menuController.getMenuById);

/**
 * PUT /api/menus/:id - Update menu
 * @description Update menu information (requires authentication and admin privilege)
 */
router.put(BY_ID, auth, checkAdmin, menuController.updateMenu);

/**
 * DELETE /api/menus/:id - Delete menu
 * @description Delete a menu item (requires authentication and admin privilege)
 */
router.delete(BY_ID, auth, checkAdmin, menuController.deleteMenu);

module.exports = router;