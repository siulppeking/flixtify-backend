const { body } = require('express-validator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');

// Validation constants
const PROJECT_STATUS = ['Active', 'On Hold', 'Completed'];
const PROJECT_VALIDATION_RULES = {
  NAME_MIN_LENGTH: 3,
  NAME_REQUIRED_MSG: 'Project name is required',
  NAME_MIN_LENGTH_MSG: 'Minimum 3 characters required',
  DATE_INVALID_MSG: 'Invalid date format (YYYY-MM-DD)',
  STATUS_INVALID_MSG: 'Invalid status'
};

const projectValidationRules = [
  body('name')
    .exists()
    .withMessage(PROJECT_VALIDATION_RULES.NAME_REQUIRED_MSG)
    .isLength({ min: PROJECT_VALIDATION_RULES.NAME_MIN_LENGTH })
    .withMessage(PROJECT_VALIDATION_RULES.NAME_MIN_LENGTH_MSG),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage(PROJECT_VALIDATION_RULES.DATE_INVALID_MSG)
    .toDate(),

  body('status')
    .optional()
    .isIn(PROJECT_STATUS)
    .withMessage(PROJECT_VALIDATION_RULES.STATUS_INVALID_MSG)
];

/**
 * Validation middleware chain for project creation.
 */
exports.validateProjectCreation = [
  ...projectValidationRules,
  handleValidationErrors
];