const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin'); // Importar el nuevo middleware

router.route('/')
    .get(roleController.getAllRoles) // Aplicar checkAdmin
    .post(roleController.createRole); // Aplicar checkAdmin

router.route('/:id')
    .get(roleController.getRoleById)
    .put(roleController.updateRole)
    .delete(roleController.deleteRole);

module.exports = router;