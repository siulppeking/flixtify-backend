// menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middlewares/authMiddleware');
// const checkAdmin = require('../middlewares/adminMiddleware'); // Necesario para seguridad real

router.route('/')
    .get( menuController.getAllMenus)     // auth, checkAdmin, ...
    .post( menuController.createMenu);    // auth, checkAdmin, ...

router.route('/:id')
    .get( menuController.getMenuById)     // auth, checkAdmin, ...
    .put( menuController.updateMenu)      // auth, checkAdmin, ...
    .delete( menuController.deleteMenu);  // auth, checkAdmin, ...

module.exports = router;