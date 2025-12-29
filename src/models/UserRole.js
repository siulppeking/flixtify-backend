const mongoose = require('mongoose');

const UserRoleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: ['userId', 'roleId'] }]
  }
);

module.exports = mongoose.model('UserRole', UserRoleSchema);