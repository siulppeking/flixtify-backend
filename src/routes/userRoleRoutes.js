// User Role Routes - Manages user-role assignments and relationships
const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

router.post('/', auth, checkAdmin, userRoleController.assignRoleToUser);
router.get('/:userId', auth, userRoleController.getRolesByUser);
router.delete('/:userId/:roleId', auth, checkAdmin, userRoleController.revokeRoleFromUser);

module.exports = router;