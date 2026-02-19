/**
 * Menu Controller
 *
 * Manages dynamic menu structure and role-based menu access.
 * Handles CRUD operations for menu items and menu-role associations.
 * Supports hierarchical menu structures for flexible navigation setup.
 *
 * @module controllers/menuController
 * @requires ../models/Menu
 * @requires ../models/RoleMenu
 */
const Menu = require('../models/Menu');
const RoleMenu = require('../models/RoleMenu');

// Menu type constants
const MENU_TYPES = ['menu', 'submenu', 'form'];

// Menu operation status codes  
const MENU_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

/**
 * Error messages for menu operations
 * @type {Object.<string, string>}
 */
const ERROR_MESSAGES = {
  MENU_NOT_FOUND: 'Menu item not found',
  MENU_NOT_FOUND_UPDATE: 'Menu item not found for update',
  MENU_NOT_FOUND_DELETE: 'Menu item not found for deletion',
  REQUIRED_FIELDS: 'Name, path, and type are required',
  INVALID_TYPE: `Invalid menu type. Must be one of: ${MENU_TYPES.join(', ')}`,
  PARENT_NOT_FOUND: 'Parent menu not found',
  SELF_PARENT: 'A menu item cannot be its own parent',
  PATH_UNIQUE: 'Path must be unique',
  HAS_CHILDREN: 'Cannot delete menu. Children are currently linked to it',
  SERVER_ERROR_FETCH: 'Server error fetching menus',
  SERVER_ERROR_FETCH_SINGLE: 'Server error fetching menu',
  SERVER_ERROR_CREATE: 'Server error creating menu',
  SERVER_ERROR_UPDATE: 'Server error updating menu',
  SERVER_ERROR_DELETE: 'Server error deleting menu'
};

const SUCCESS_MESSAGES = {
  MENU_CREATED: 'Menu item created successfully',
  MENU_UPDATED: 'Menu item updated successfully',
  MENU_DELETED: 'Menu item and all associated role permissions deleted successfully'
};

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find({}).sort({ name: 1 });
    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: ERROR_MESSAGES.MENU_NOT_FOUND });
    }
    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_FETCH_SINGLE });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { name, icon, path, type, parent } = req.body;

    if (!name || !path || !type) {
      return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
    }

    if (!MENU_TYPES.includes(type)) {
      return res.status(400).json({ message: ERROR_MESSAGES.INVALID_TYPE });
    }

    if (parent) {
      const parentMenu = await Menu.findById(parent);
      if (!parentMenu) {
        return res.status(404).json({ message: ERROR_MESSAGES.PARENT_NOT_FOUND });
      }
    }

    const newMenu = await Menu.create({
      name,
      icon,
      path,
      type,
      parent: parent || null
    });

    res.status(201).json({
      message: SUCCESS_MESSAGES.MENU_CREATED,
      menu: newMenu
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: ERROR_MESSAGES.PATH_UNIQUE });
    }
    console.error('Error creating menu:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_CREATE });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { name, icon, path, type, parent } = req.body;

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, icon, path, type, parent: parent || null },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: ERROR_MESSAGES.MENU_NOT_FOUND_UPDATE });
    }

    // Opcional: Validar que el nuevo padre no sea el propio elemento, previniendo bucles
    if (updatedMenu._id.toString() === updatedMenu.parent?.toString()) {
      return res.status(400).json({ message: ERROR_MESSAGES.SELF_PARENT });
    }

    res.json({
      message: SUCCESS_MESSAGES.MENU_UPDATED,
      menu: updatedMenu
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_UPDATE });
  }
};

// --- Función 5: Eliminar un Menú (Delete) ---
// Debe verificar si otros menús lo usan como padre y limpiar la tabla de enlace RoleMenu
exports.deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: ERROR_MESSAGES.MENU_NOT_FOUND_DELETE });
    }

    // 1. Verificar dependencias de hijos: ¿Otros menús lo usan como padre?
    const childMenus = await Menu.countDocuments({ parent: menuId });
    if (childMenus > 0) {
      return res.status(400).json({
        message: `${ERROR_MESSAGES.HAS_CHILDREN}. ${childMenus} children are currently linked to it.`
      });
    }

    // 2. Eliminar todas las relaciones en RoleMenu (permisos)
    await RoleMenu.deleteMany({ menuId });

    // 3. Eliminar el documento Menu
    await Menu.deleteOne({ _id: menuId });

    res.json({
      message: SUCCESS_MESSAGES.MENU_DELETED
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR_DELETE });
  }
};