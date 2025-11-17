// projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/authMiddleware'); // Middleware de autenticación
const { validateProjectCreation } = require('../validators/projectValidator'); // <--- 1. Importación

// Rutas base: /api/projects
router.route('/')
    .post(auth, validateProjectCreation, projectController.createProject)
    .get(auth, projectController.getAllProjects);

// Rutas por ID: /api/projects/:id
router.route('/:id')
    .get(auth, projectController.getProjectById)
    .put(auth, projectController.updateProject)
    .delete(auth, projectController.deleteProject);

module.exports = router;