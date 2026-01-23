// Role Routes - CRUD operations for managing roles and permissions
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');

router.route('/')
  .get(auth, checkAdmin, roleController.getAllRoles)
  .post(auth, checkAdmin, roleController.createRole);

router.route('/:id')
  .get(auth, roleController.getRoleById)
  .put(auth, checkAdmin, roleController.updateRole)
  .delete(auth, checkAdmin, roleController.deleteRole);

module.exports = router;