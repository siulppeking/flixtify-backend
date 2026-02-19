/**
 * Role Constants Configuration
 * Centralized role definitions and role-related constants
 */

module.exports = {
  // Role names
  ROLE_NAMES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
    MODERATOR: 'MODERATOR',
    VIEWER: 'VIEWER'
  },

  // Role descriptions
  ROLE_DESCRIPTIONS: {
    ADMIN: 'Administrator with full system access',
    USER: 'Regular user with standard permissions',
    MODERATOR: 'Moderator with elevated permissions',
    VIEWER: 'Read-only access to resources'
  },

  // Default role
  DEFAULT_ROLE: 'USER',
  ADMIN_ROLE: 'ADMIN',

  // Role validation constraints
  ROLE_CONSTRAINTS: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MIN_DESCRIPTION_LENGTH: 0,
    MAX_DESCRIPTION_LENGTH: 500
  },

  // Role operation messages
  ROLE_OPERATION_MESSAGES: {
    CREATED: 'Role created successfully',
    UPDATED: 'Role updated successfully',
    DELETED: 'Role deleted successfully',
    NOT_FOUND: 'Role not found',
    ALREADY_EXISTS: 'A role with this name already exists',
    IN_USE: 'Cannot delete role. Users are still assigned to this role',
    REQUIRED: 'Role name is required'
  }
};
