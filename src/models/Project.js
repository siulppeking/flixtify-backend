const mongoose = require('mongoose');

const PROJECT_STATUS = ['Active', 'On Hold', 'Completed'];
const DEFAULT_PROJECT_STATUS = 'Active';

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