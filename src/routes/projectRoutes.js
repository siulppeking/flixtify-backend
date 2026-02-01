// Project Routes - CRUD operations for projects
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/authMiddleware');
const { validateProjectCreation } = require('../validators/projectValidator');

// Route path constants
const PROJECT_ROUTES = {
  ROOT: '/',
  BY_ID: '/:id'
};

/**
 * POST /api/projects - Create new project
 * @description Create a new project (requires authentication)
 */
router.post(PROJECT_ROUTES.ROOT, auth, validateProjectCreation, projectController.createProject);

/**
 * GET /api/projects - Get all projects
 * @description Retrieve all projects (requires authentication)
 */
router.get(PROJECT_ROUTES.ROOT, auth, projectController.getAllProjects);

/**
 * GET /api/projects/:id - Get project by ID
 * @description Retrieve a single project by ID (requires authentication)
 */
router.get(PROJECT_ROUTES.BY_ID, auth, projectController.getProjectById);

/**
 * PUT /api/projects/:id - Update project
 * @description Update project information (requires authentication)
 */
router.put(PROJECT_ROUTES.BY_ID, auth, projectController.updateProject);

/**
 * DELETE /api/projects/:id - Delete project
 * @description Delete a project (requires authentication)
 */
router.delete(PROJECT_ROUTES.BY_ID, auth, projectController.deleteProject);

module.exports = router;