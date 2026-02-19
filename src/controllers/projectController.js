/**
 * Project Controller
 * Handles project CRUD operations and project lifecycle management
 * Manages create, read, update, delete operations authorized by project ownership
 * @module controllers/projectController
 */
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');
const httpStatus = require('../constants/httpStatus');
const errorMessages = require('../constants/errorMessages');
const apiMessages = require('../constants/apiMessages');
const dbFields = require('../constants/dbFields');
const errorHandler = require('../utils/errorHandler');

// Database query projections for consistent field selection
const PROJECT_QUERY_CONFIG = {
  PROJECT_PROJECTION: '-__v',
  TASK_PROJECTION: '-__v',
  BASIC_FIELDS: '_id name description status startDate dueDate createdAt updatedAt',
  OWNER_FIELDS: 'ownerId'
};

// Project operation response codes
const PROJECT_OPERATIONS = {
  CREATED_STATUS_CODE: 201,
  SUCCESS_STATUS_CODE: 200,
  DELETED_STATUS_CODE: 200
};

// Standardized project messages
const PROJECT_MESSAGES = {
  CREATED: 'Project created successfully',
  UPDATED: 'Project updated successfully', 
  DELETED: 'Project and associated tasks deleted successfully',
  FETCHED: 'Projects retrieved successfully',
  NOT_FOUND: 'Project not found or access denied',
  SERVER_ERROR_CREATE: 'Server error creating project',
  SERVER_ERROR_FETCH: 'Server error fetching projects',
  SERVER_ERROR_FETCH_SINGLE: 'Server error fetching project',
  SERVER_ERROR_UPDATE: 'Server error updating project',
  SERVER_ERROR_DELETE: 'Server error deleting project'
};

const PROJECT_PROJECTION = PROJECT_QUERY_CONFIG.PROJECT_PROJECTION;
const TASK_PROJECTION = PROJECT_QUERY_CONFIG.TASK_PROJECTION;

/**
 * Validates if a project belongs to the specified owner
 * @param {string} projectId - The project ID
 * @param {string} ownerId - The owner ID
 * @returns {Promise<Object|null>} Project object if found and owned, null otherwise
 */
const validateProjectOwnership = async (projectId, ownerId) => {
  return Project.findOne({ _id: projectId, ownerId });
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
    res.status(PROJECT_OPERATIONS.CREATED_STATUS_CODE).json({
      message: PROJECT_MESSAGES.CREATED,
      project: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: PROJECT_MESSAGES.SERVER_ERROR_CREATE });
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

    const projects = await Project.find({ ownerId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      message: ERROR_MESSAGES.SERVER_ERROR_FETCH
    });
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
    const { id: projectId } = req.params;

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
    const { id: projectId } = req.params;
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
    console.error('Error updating project:', error);
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
    const { id: projectId } = req.params;

    // 1. Intentar eliminar el proyecto (filtando por dueño)
    const projectResult = await Project.deleteOne({ _id: projectId, ownerId });

    if (projectResult.deletedCount === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.PROJECT_NOT_FOUND });
    }

    // 2. Eliminar todas las tareas asociadas a ese proyecto (limpieza en cascada)
    await Task.deleteMany({ projectId });

    res.json({ message: SUCCESS_MESSAGES.PROJECT_DELETED });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_DELETE });
  }
};