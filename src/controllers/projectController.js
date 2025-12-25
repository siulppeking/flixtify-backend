const Project = require('../models/Project');
const Task = require('../models/Task');

/**
 * Create a new project for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.createProject = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, description, dueDate, startDate, status } = req.body;

    const newProject = await Project.create({
      name,
      description,
      dueDate,
      startDate,
      status,
      ownerId
    });
    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error creating project' });
  }
};

/**
 * Get all projects for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.getAllProjects = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const projects = await Project.find({ ownerId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
};

/**
 * Get a specific project by ID if the user is the owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.getProjectById = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const projectId = req.params.id;

    const project = await Project.findOne({ _id: projectId, ownerId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
};

/**
 * Update a project if the user is the owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.updateProject = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const projectId = req.params.id;
    const updates = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, ownerId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }
        res.json({
            message: "Project updated successfully.",
            project: updatedProject
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Server error updating project." });
    }
};

/**
 * Delete a project and all associated tasks if the user is the owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.deleteProject = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const projectId = req.params.id;

        // 1. Intentar eliminar el proyecto (filtando por dueño)
        const projectResult = await Project.deleteOne({ _id: projectId, ownerId });

        if (projectResult.deletedCount === 0) {
            return res.status(404).json({ message: "Project not found or access denied." });
        }

        // 2. Eliminar todas las tareas asociadas a ese proyecto (limpieza en cascada)
        await Task.deleteMany({ projectId });

        res.json({ message: "Project and associated tasks deleted successfully." });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Server error deleting project." });
    }
};