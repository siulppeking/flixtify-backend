// Project Controller - Handles project and task management operations
const Project = require('../models/Project');
const Task = require('../models/Task');

// Constants
const ERROR_MESSAGES = {
  PROJECT_NOT_FOUND: 'Project not found or access denied',
  SERVER_ERROR_CREATE: 'Server error creating project',
  SERVER_ERROR_FETCH: 'Server error fetching projects',
  SERVER_ERROR_FETCH_SINGLE: 'Server error fetching project',
  SERVER_ERROR_UPDATE: 'Server error updating project',
  SERVER_ERROR_DELETE: 'Server error deleting project'
};

const SUCCESS_MESSAGES = {
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  PROJECT_DELETED: 'Project and associated tasks deleted successfully'
};

/**
 * Validates if a project belongs to the specified owner
 * @param {string} projectId - The project ID
 * @param {string} ownerId - The owner ID
 * @returns {Promise<Object|null>} Project object if found and owned, null otherwise
 */
const validateProjectOwnership = async (projectId, ownerId) => {
  return await Project.findOne({ _id: projectId, ownerId });
};

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
      message: SUCCESS_MESSAGES.PROJECT_CREATED,
      project: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_CREATE });
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
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH });
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

    const project = await validateProjectOwnership(projectId, ownerId);

    if (!project) {
      return res.status(404).json({ message: ERROR_MESSAGES.PROJECT_NOT_FOUND });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH_SINGLE });
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
      return res.status(404).json({ message: ERROR_MESSAGES.PROJECT_NOT_FOUND });
    }
        res.json({
            message: SUCCESS_MESSAGES.PROJECT_UPDATED,
            project: updatedProject
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_UPDATE });
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
            return res.status(404).json({ message: ERROR_MESSAGES.PROJECT_NOT_FOUND });
        }

        // 2. Eliminar todas las tareas asociadas a ese proyecto (limpieza en cascada)
        await Task.deleteMany({ projectId });

        res.json({ message: SUCCESS_MESSAGES.PROJECT_DELETED });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_DELETE });
    }
};