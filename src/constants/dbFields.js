/**
 * Database Field Constants
 * Centralized collection field name constants used across models
 */

module.exports = {
  // Common fields
  USER_ID: 'userId',
  PROJECT_ID: 'projectId',
  ROLE_ID: 'roleId',
  OWNER_ID: 'ownerId',
  
  // Field projections (fields to exclude from responses)
  PROJECTION_EXCLUDE_PASSWORD: '-password -twoFAVerifiedSession',
  PROJECTION_EXCLUDE_VERSION: '-__v',
  PROJECTION_EXCLUDE_SENSITIVE: '-password -twoFA.secret -__v',
  
  // Common query fields
  EMAIL_FIELD: 'email',
  USERNAME_FIELD: 'username',
  NAME_FIELD: 'name',
  STATUS_FIELD: 'status',
  CREATED_AT_FIELD: 'createdAt',
  UPDATED_AT_FIELD: 'updatedAt',
  IS_ACTIVE_FIELD: 'isActive',
  DELETED_FIELD: 'deleted',
  ENABLED_FIELD: 'enabled'
};
