const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');

router.route('/')
  .post(auth, taskController.createTask)
  .get(auth, taskController.getAllTasks);

router.route('/:id')
  .get(auth, taskController.getTaskById)
  .put(auth, taskController.updateTask)
  .delete(auth, taskController.deleteTask);

module.exports = router;