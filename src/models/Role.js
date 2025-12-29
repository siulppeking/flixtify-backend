const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50
    },
    description: {
      type: String,
      maxlength: 500
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', RoleSchema);