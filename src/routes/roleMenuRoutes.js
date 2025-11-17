// roleMenuRoutes.js
const express = require('express');
const router = express.Router();
const roleMenuController = require('../controllers/roleMenuController');
const auth = require('../middlewares/authMiddleware');
// const checkAdmin = require('../middlewares/adminMiddleware'); 

// Asignar un menú a un rol (POST para crear la relación)
router.post('/', roleMenuController.assignMenuToRole);

// Obtener todos los menús asignados a un rol específico
router.get('/:roleId', roleMenuController.getMenusByRole);

// Revocar un menú de un rol (DELETE para eliminar la relación)
router.delete('/:roleId/:menuId', roleMenuController.revokeMenuFromRole);

module.exports = router;