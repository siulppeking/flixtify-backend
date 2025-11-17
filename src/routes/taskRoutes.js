// taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware'); // Middleware de autenticación

// Rutas base: /api/tasks
router.route('/')
    .post(auth, taskController.createTask)
    .get(auth, taskController.getAllTasks);

// Rutas por ID: /api/tasks/:id
router.route('/:id')
    .get(auth, taskController.getTaskById)
    .put(auth, taskController.updateTask)
    .delete(auth, taskController.deleteTask);

module.exports = router;