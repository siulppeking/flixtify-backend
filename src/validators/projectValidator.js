// src/validators/projectValidator.js (Versión simplificada)

const { body } = require('express-validator');
const handleValidationErrors = require('../middlewares/handleValidationErrors'); // <--- Importación

// Array de reglas de validación (¡solo las reglas, sin el manejador de errores!)
const projectValidationRules = [
    body('name')
        .exists().withMessage('El nombre es obligatorio.')
        .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres.'),

    body('dueDate')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD).')
        .toDate(),

    body('status')
        .optional()
        .isIn(['Active', 'On Hold', 'Completed']).withMessage('Estado inválido.'),
];

// Exportamos las reglas COMBINADAS con el manejador de errores
exports.validateProjectCreation = [
    ...projectValidationRules,
    handleValidationErrors // <--- Aplicación del middleware centralizado
];

// Las rutas lo consumirán en el router.post(auth, validateProjectCreation, projectController.createProject)