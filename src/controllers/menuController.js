const Menu = require('../models/Menu');
const RoleMenu = require('../models/RoleMenu');

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find({}).sort({ name: 1 });
    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: 'Server error fetching menus' });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Server error fetching menu' });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { name, icon, path, type, parent } = req.body;

    if (!name || !path || !type) {
      return res.status(400).json({ message: 'Name, path, and type are required' });
    }

    if (!['menu', 'submenu', 'form'].includes(type)) {
      return res.status(400).json({ message: "Invalid menu type. Must be 'menu', 'submenu', or 'form'" });
    }

    if (parent) {
      const parentMenu = await Menu.findById(parent);
      if (!parentMenu) {
        return res.status(404).json({ message: 'Parent menu not found' });
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
      message: 'Menu item created successfully',
      menu: newMenu
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Path must be unique' });
    }
    console.error('Error creating menu:', error);
    res.status(500).json({ message: 'Server error creating menu' });
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
            return res.status(404).json({ message: "Menu item not found for update." });
        }

        // Opcional: Validar que el nuevo padre no sea el propio elemento, previniendo bucles
        if (updatedMenu._id.toString() === updatedMenu.parent?.toString()) {
            return res.status(400).json({ message: "A menu item cannot be its own parent." });
        }

        res.json({
            message: "Menu item updated successfully.",
            menu: updatedMenu
        });
    } catch (error) {
        console.error("Error updating menu:", error);
        res.status(500).json({ message: "Server error updating menu." });
    }
};

// --- Función 5: Eliminar un Menú (Delete) ---
// Debe verificar si otros menús lo usan como padre y limpiar la tabla de enlace RoleMenu
exports.deleteMenu = async (req, res) => {
    try {
        const menuId = req.params.id;

        const menu = await Menu.findById(menuId);
        if (!menu) {
            return res.status(404).json({ message: "Menu item not found for deletion." });
        }

        // 1. Verificar dependencias de hijos: ¿Otros menús lo usan como padre?
        const childMenus = await Menu.countDocuments({ parent: menuId });
        if (childMenus > 0) {
            return res.status(400).json({
                message: `Cannot delete menu. ${childMenus} children (submenus/forms) are currently linked to it.`
            });
        }

        // 2. Eliminar todas las relaciones en RoleMenu (permisos)
        await RoleMenu.deleteMany({ menuId });

        // 3. Eliminar el documento Menu
        await Menu.deleteOne({ _id: menuId });

        res.json({
            message: "Menu item and all associated role permissions deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting menu:", error);
        res.status(500).json({ message: "Server error deleting menu." });
    }
};