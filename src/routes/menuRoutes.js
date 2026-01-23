// Menu Routes - Endpoints for managing dynamic menu items
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

router.route('/')
  .get(auth, menuController.getAllMenus)
  .post(auth, checkAdmin, menuController.createMenu);

router.route('/:id')
  .get(auth, menuController.getMenuById)
  .put(auth, checkAdmin, menuController.updateMenu)
  .delete(auth, checkAdmin, menuController.deleteMenu);

module.exports = router;