const { body } = require('express-validator');
const handleValidationErrors = require('../middlewares/handleValidationErrors');

const projectValidationRules = [
  body('name')
    .exists()
    .withMessage('Project name is required')
    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters required'),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format (YYYY-MM-DD)')
    .toDate(),

  body('status')
    .optional()
    .isIn(['Active', 'On Hold', 'Completed'])
    .withMessage('Invalid status')
];

exports.validateProjectCreation = [
  ...projectValidationRules,
  handleValidationErrors
];