const mongoose = require('mongoose');

// Constants for Task model enums
const PRIORITY_LEVELS = ['Low', 'Medium', 'High'];
const DEFAULT_PRIORITY = 'Medium';

const TASK_STATUS = ['To Do', 'In Progress', 'Done'];
const DEFAULT_STATUS = 'To Do';

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