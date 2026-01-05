const mongoose = require('mongoose');

// Constants for Role model
const ROLE_FIELDS = {
  NAME: 'name',
  DESCRIPTION: 'description'
};

/**
 * Role schema holds application roles
 */
const RoleSchema = new mongoose.Schema(
  {
    [ROLE_FIELDS.NAME]: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50
    },
    [ROLE_FIELDS.DESCRIPTION]: {
      type: String,
      maxlength: 500
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', RoleSchema);