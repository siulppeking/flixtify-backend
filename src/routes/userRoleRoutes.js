// userRoleRoutes.js
const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');
const auth = require('../middlewares/authMiddleware');
// const checkAdmin = require('../middlewares/adminMiddleware'); 

// Asignar un rol a un usuario (POST para crear la relación)
router.post('/', userRoleController.assignRoleToUser); 

// Obtener todos los roles asignados a un usuario específico
router.get('/:userId', userRoleController.getRolesByUser);

// Revocar un rol de un usuario (DELETE para eliminar la relación)
router.delete('/:userId/:roleId', userRoleController.revokeRoleFromUser);

module.exports = router;