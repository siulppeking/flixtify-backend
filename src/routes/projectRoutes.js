const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/authMiddleware');
const { validateProjectCreation } = require('../validators/projectValidator');

router.route('/')
  .post(auth, validateProjectCreation, projectController.createProject)
  .get(auth, projectController.getAllProjects);

router.route('/:id')
  .get(auth, projectController.getProjectById)
  .put(auth, projectController.updateProject)
  .delete(auth, projectController.deleteProject);

module.exports = router;