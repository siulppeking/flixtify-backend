const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin'); // Importar el nuevo middleware

router.route('/')
    .get(auth, checkAdmin, roleController.getAllRoles) // Aplicar checkAdmin
    .post(auth, checkAdmin, roleController.createRole); // Aplicar checkAdmin

router.route('/:id')
    .get(auth, checkAdmin, roleController.getRoleById)
    .put(auth, checkAdmin, roleController.updateRole)
    .delete(auth, checkAdmin, roleController.deleteRole);

module.exports = router;