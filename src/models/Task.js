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
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    priority: {
      type: String,
      enum: PRIORITY_LEVELS,
      default: DEFAULT_PRIORITY
    },
    status: {
      type: String,
      enum: TASK_STATUS,
      default: DEFAULT_STATUS
    },
    dueDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);