// Task Routes - CRUD operations and task management endpoints
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');

// Route path constants
const TASK_ROUTES = {
  ROOT: '/',
  BY_ID: '/:id'
};

const { ROOT, BY_ID } = TASK_ROUTES;

/**
 * POST /api/tasks - Create new task
 * @description Create a new task (requires authentication)
 */
router.post(ROOT, auth, taskController.createTask);

/**
 * GET /api/tasks - Get all tasks
 * @description Retrieve all tasks (requires authentication)
 */
router.get(ROOT, auth, taskController.getAllTasks);

/**
 * GET /api/tasks/:id - Get task by ID
 * @description Retrieve a single task by ID (requires authentication)
 */
router.get(BY_ID, auth, taskController.getTaskById);

/**
 * PUT /api/tasks/:id - Update task
 * @description Update task information (requires authentication)
 */
router.put(BY_ID, auth, taskController.updateTask);

/**
 * DELETE /api/tasks/:id - Delete task
 * @description Delete a task (requires authentication)
 */
router.delete(BY_ID, auth, taskController.deleteTask);

module.exports = router;