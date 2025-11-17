// userManagementRoutes.js
const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/userManagementController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

// Todas estas rutas requieren Autenticación Y ser un rol ADMIN activo
router.route('/')
    .get(auth, checkAdmin, userManagementController.getAllUsers);

router.route('/:id')
    .get(auth, checkAdmin, userManagementController.getUserById)
    .put(auth, checkAdmin, userManagementController.updateUser)
    .delete(auth, checkAdmin, userManagementController.deleteUser);

module.exports = router;