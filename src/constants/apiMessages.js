/**
 * API Response Messages Constants
 * Centralized success and info messages for API responses
 */

module.exports = {
  // User messages
  USER_MESSAGES: {
    CREATED: 'User created successfully',
    REGISTERED: 'User registered successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    PROFILE_RETRIEVED: 'User profile retrieved successfully'
  },

  // Project messages
  PROJECT_MESSAGES: {
    CREATED: 'Project created successfully',
    UPDATED: 'Project updated successfully',
    DELETED: 'Project and associated tasks deleted successfully',
    RETRIEVED: 'Project retrieved successfully',
    LIST_RETRIEVED: 'Projects list retrieved successfully'
  },

  // Task messages
  TASK_MESSAGES: {
    CREATED: 'Task created successfully',
    UPDATED: 'Task updated successfully',
    DELETED: 'Task deleted successfully',
    RETRIEVED: 'Task retrieved successfully',
    LIST_RETRIEVED: 'Tasks list retrieved successfully',
    STATUS_CHANGED: 'Task status changed successfully'
  },

  // Role messages
  ROLE_MESSAGES: {
    CREATED: 'Role created successfully',
    UPDATED: 'Role updated successfully',
    DELETED: 'Role and all its associated menu permissions deleted successfully',
    RETRIEVED: 'Role retrieved successfully',
    LIST_RETRIEVED: 'Roles list retrieved successfully'
  },

  // Role-User messages
  ROLEUSER_MESSAGES: {
    ASSIGNED: 'Role assigned to user successfully',
    REMOVED: 'Role removed from user successfully',
    ACTIVATED: 'User role activated successfully',
    RETRIEVED: 'User roles retrieved successfully'
  },

  // Menu messages
  MENU_MESSAGES: {
    CREATED: 'Menu created successfully',
    UPDATED: 'Menu updated successfully',
    DELETED: 'Menu deleted successfully',
    RETRIEVED: 'Menu retrieved successfully',
    LIST_RETRIEVED: 'Menus list retrieved successfully'
  },

  // Authentication messages
  AUTH_MESSAGES: {
    TWO_FA_REQUIRED: '2FA token required',
    TWO_FA_ENABLED: '2FA enabled successfully',
    TWO_FA_DISABLED: '2FA disabled successfully',
    TWO_FA_QR_GENERATED: '2FA QR code generated successfully'
  },

  // General messages
  GENERAL_MESSAGES: {
    SUCCESS: 'Operation completed successfully',
    WELCOME: 'Bienvenido a Flixtify Backend v1',
    OK: 'OK'
  }
};
