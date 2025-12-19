const Task = require('../models/Task');
const Project = require('../models/Project');

const checkTaskOwnership = async (taskId, ownerId) => {
  try {
    const task = await Task.findById(taskId).populate({
      path: 'projectId',
      select: 'ownerId'
    });

    if (!task || !task.projectId) return null;

    if (task.projectId.ownerId.toString() !== ownerId.toString()) {
      return null;
    }
    return task;
  } catch (error) {
    return null;
  }
};

exports.createTask = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { projectId, title, description, priority, status, dueDate } = req.body;

    const project = await Project.findOne({ _id: projectId, ownerId });
    if (!project) {
      return res.status(403).json({ message: 'Project not found or access denied' });
    }

    const newTask = await Task.create({
      projectId,
      title,
      description,
      priority,
      status,
      dueDate
    });
    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const userProjects = await Project.find({ ownerId }).select('_id');
    const projectIds = userProjects.map(p => p._id);

    const tasks = await Task.find({ projectId: { $in: projectIds } })
      .populate('projectId', 'name')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// --- READ One Task (Verifica dueño del proyecto) ---
exports.getTaskById = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const task = await checkTaskOwnership(req.params.id, ownerId);

        if (!task) {
            return res.status(404).json({ message: "Task not found or access denied." });
        }

        // Poblar si es necesario, excluyendo el ownerId del proyecto para el cliente
        await task.populate('projectId', 'name dueDate');

        res.json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Server error fetching task." });
    }
};

// --- UPDATE Task (Verifica dueño del proyecto) ---
exports.updateTask = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const taskId = req.params.id;
        const updates = req.body;

        // 1. Verificar propiedad antes de actualizar
        const task = await checkTaskOwnership(taskId, ownerId);
        if (!task) {
            return res.status(404).json({ message: "Task not found or access denied." });
        }

        // 2. Si es dueño, actualiza.
        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true });

        res.json({ message: "Task updated successfully.", task: updatedTask });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Server error updating task." });
    }
};

// --- DELETE Task (Verifica dueño del proyecto) ---
exports.deleteTask = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const taskId = req.params.id;

        // 1. Verificar propiedad antes de eliminar
        const task = await checkTaskOwnership(taskId, ownerId);
        if (!task) {
            return res.status(404).json({ message: "Task not found or access denied." });
        }

        // 2. Si es dueño, elimina
        await Task.deleteOne({ _id: taskId });

        res.json({ message: "Task deleted successfully." });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error deleting task." });
    }
};