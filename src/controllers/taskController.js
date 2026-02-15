// Task Controller - Manages task creation, updates, completion, and status tracking
const Task = require('../models/Task');
const Project = require('../models/Project');

// Constants
const ERROR_MESSAGES = {
  TASK_NOT_FOUND: 'Task not found or access denied.',
  PROJECT_NOT_FOUND: 'Project not found or access denied',
  SERVER_ERROR_CREATE: 'Server error creating task',
  SERVER_ERROR_FETCH: 'Server error fetching tasks',
  SERVER_ERROR_UPDATE: 'Server error updating task.',
  SERVER_ERROR_DELETE: 'Server error deleting task.'
};

const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully.',
  TASK_DELETED: 'Task deleted successfully.'
};

/**
 * Validates task ownership through project ownership
 * @param {string} taskId - The task ID to validate
 * @param {string} ownerId - The owner ID to validate against
 * @returns {Promise<Object|null>} Task object if valid, null otherwise
 */
const validateTaskOwnership = async (taskId, ownerId) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(ownerId)
    ) {
      return null;
    }

    const task = await Task.findById(taskId)
      .select('projectId')
      .populate({
        path: 'projectId',
        select: 'ownerId',
        options: { lean: true }
      })
      .lean();

    if (!task || !task.projectId) return null;

    if (task.projectId.ownerId.toString() !== ownerId.toString()) {
      return null;
    }

    return task;
  } catch (error) {
    return null;
  }
};

/**
 * Create a new task in a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.createTask = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { projectId, title, description, priority, status, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(403).json({
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      ownerId
    }).lean();

    if (!project) {
      return res.status(403).json({
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND
      });
    }

    const newTask = await Task.create({
      projectId,
      title,
      description,
      priority,
      status,
      dueDate
    });

    return res.status(201).json({
      message: SUCCESS_MESSAGES.TASK_CREATED,
      task: newTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      message: ERROR_MESSAGES.SERVER_ERROR_CREATE
    });
  }
};

/**
 * Get all tasks for projects owned by the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.getAllTasks = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const userProjects = await Project.find({ ownerId })
      .select('_id')
      .lean();

    if (!userProjects.length) {
      return res.status(200).json([]);
    }

    const projectIds = userProjects.map(p => p._id);

    const tasks = await Task.find({
      projectId: { $in: projectIds }
    })
      .populate('projectId', 'name')
      .sort({ dueDate: 1 })
      .lean();

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      message: ERROR_MESSAGES.SERVER_ERROR_FETCH
    });
  }
};


/**
 * Get a specific task by ID if user owns the project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.getTaskById = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id: taskId } = req.params;

    const isOwner = await validateTaskOwnership(taskId, ownerId);

    if (!isOwner) {
      return res.status(404).json({
        message: ERROR_MESSAGES.TASK_NOT_FOUND
      });
    }

    const task = await Task.findById(taskId)
      .populate('projectId', 'name dueDate')
      .lean();

    if (!task) {
      return res.status(404).json({
        message: ERROR_MESSAGES.TASK_NOT_FOUND
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({
      message: ERROR_MESSAGES.SERVER_ERROR_FETCH
    });
  }
};


/**
 * Update a task if user owns the project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.updateTask = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id: taskId } = req.params;
    const updates = req.body;

    // 1. Verificar propiedad antes de actualizar
    const task = await validateTaskOwnership(taskId, ownerId);
    if (!task) {
      return res.status(404).json({ message: ERROR_MESSAGES.TASK_NOT_FOUND });
    }

    // 2. Si es dueño, actualiza.
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true });

    res.json({ message: SUCCESS_MESSAGES.TASK_UPDATED, task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_UPDATE });
  }
};

/**
 * Delete a task if user owns the project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.deleteTask = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id: taskId } = req.params;

    // 1. Verificar propiedad antes de eliminar
    const task = await validateTaskOwnership(taskId, ownerId);
    if (!task) {
      return res.status(404).json({ message: ERROR_MESSAGES.TASK_NOT_FOUND });
    }

    // 2. Si es dueño, elimina
    await Task.deleteOne({ _id: taskId });

    res.json({ message: SUCCESS_MESSAGES.TASK_DELETED });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_DELETE });
  }
};