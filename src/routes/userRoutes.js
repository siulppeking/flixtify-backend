// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware'); // Middleware de autenticación
// Asumiendo que tienes un middleware para verificar roles de administrador
//const { checkAdminRole } = require('../middlewares/authMiddleware');
// Opcional: Si tienes validaciones específicas para el registro o actualización
// const { validateUserRegistration, validateUserUpdate } = require('../validators/userValidator'); 

// --- Rutas de Usuario (CRUD) ---

// 1. Registro (CREATE) - Generalmente no requiere autenticación
router.post('/',
    // validateUserRegistration, // <--- Opcional: Agregar validación
    userController.createUser
);

// Rutas base: /api/users
router.route('/')
    // GET (READ All) - Requiere autenticación y rol de administrador para ver la lista completa
    .get(userController.getAllUsers);

// Rutas por ID: /api/users/:id
router.route('/:id')
    // GET (READ One) - Requiere autenticación
    // NOTA: El controlador debe verificar si el usuario es Admin O si está solicitando su propio ID.
    .get(userController.getUserById)

    // PUT (UPDATE) - Requiere autenticación
    // NOTA: Similar al GET, debe verificar si el usuario es Admin O si está actualizando su propio ID.
    .put(
        // validateUserUpdate, // <--- Opcional: Agregar validación
        userController.updateUser
    )

    // DELETE (Soft Delete) - Requiere autenticación y, generalmente, rol de administrador
    .delete(userController.deleteUser);

module.exports = router;