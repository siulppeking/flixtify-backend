/**
 * Project Model
 *
 * Represents projects that contain tasks and are assigned to users.
 * Projects serve as organizational units for grouping related tasks.
 * Each project has a status, timeline, and assigned team members.
 *
 * @module models/Project
 * @requires mongoose
 */
const mongoose = require('mongoose');

// Project field constraints
const PROJECT_FIELD_CONSTRAINTS = {
  NAME_MIN: 3,
  NAME_MAX: 100,
  DESCRIPTION_MAX: 1000
};

/**
 * Valid project status values
 * @type {string[]}
 */
const PROJECT_STATUS = ['Active', 'On Hold', 'Completed'];

/**
 * Default status for new projects
 * @type {string}
 */
const DEFAULT_PROJECT_STATUS = 'Active';

/**
 * Project schema represents project data structure
 * @typedef {Object} Project
 * @property {string} name - Project name (3-100 chars)
 * @property {string} [description] - Project description (max 1000 chars)
 * @property {string} status - Project status (Active, On Hold, Completed)
 * @property {ObjectId} assignedTo - User ID of assigned team lead
 * @property {Date} startDate - Project start date
 * @property {Date} endDate - Project end date
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    startDate: Date,
    dueDate: Date,
    status: {
      type: String,
      enum: PROJECT_STATUS,
      default: DEFAULT_PROJECT_STATUS,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);