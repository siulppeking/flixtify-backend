const mongoose = require('mongoose');

// Constants for Project model
const PROJECT_STATUS = ['Active', 'On Hold', 'Completed'];
const DEFAULT_PROJECT_STATUS = 'Active';

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startDate: Date,
    dueDate: Date,
    status: {
      type: String,
      enum: PROJECT_STATUS,
      default: DEFAULT_PROJECT_STATUS
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);