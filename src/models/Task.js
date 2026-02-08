/**
 * Task Model
 *
 * Represents individual tasks with status, priority, and deadline tracking.
 * Tasks are the atomic units of work within projects and can be assigned to users.
 * Each task tracks its lifecycle from creation to completion.
 *
 * @module models/Task
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Valid priority levels for tasks
 * @type {string[]}
 */
const PRIORITY_LEVELS = ['Low', 'Medium', 'High'];

/**
 * Default priority level for new tasks
 * @type {string}
 */
const DEFAULT_PRIORITY = 'Medium';

/**
 * Valid status values for task lifecycle
 * @type {string[]}
 */
const TASK_STATUS = ['To Do', 'In Progress', 'Done'];

/**
 * Default status for new tasks
 * @type {string}
 */
const DEFAULT_STATUS = 'To Do';

/**
 * Task schema represents individual work items
 * @typedef {Object} Task
 * @property {string} title - Task title (3-100 chars)
 * @property {string} [description] - Task description
 * @property {string} status - Current task status (To Do, In Progress, Done)
 * @property {string} priority - Task priority level (Low, Medium, High)
 * @property {ObjectId} projectId - Associated project reference
 * @property {ObjectId} assignedTo - User ID of assigned team member
 * @property {Date} dueDate - Task due date
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const TaskSchema = new mongoose.Schema(
  {
    title: {
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
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    priority: {
      type: String,
      enum: PRIORITY_LEVELS,
      default: DEFAULT_PRIORITY,
      index: true
    },
    status: {
      type: String,
      enum: TASK_STATUS,
      default: DEFAULT_STATUS,
      index: true
    },
    dueDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);