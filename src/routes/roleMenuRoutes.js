// Role Menu Routes - Associates menus with roles for access control
const express = require('express');
const router = express.Router();
const roleMenuController = require('../controllers/roleMenuController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

router.post('/', auth, checkAdmin, roleMenuController.assignMenuToRole);
router.get('/:roleId', auth, roleMenuController.getMenusByRole);
router.delete('/:roleId/:menuId', auth, checkAdmin, roleMenuController.revokeMenuFromRole);

module.exports = router;