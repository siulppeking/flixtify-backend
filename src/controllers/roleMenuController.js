const RoleMenu = require("../models/RoleMenu");
const Role = require("../models/Role");
const Menu = require("../models/Menu");

// --- Función 1: Asignar un Menú a un Rol (Create / Assign) ---
// POST /role-menus
exports.assignMenuToRole = async (req, res) => {
    try {
        const { roleId, menuId } = req.body;

        if (!roleId || !menuId) {
            return res.status(400).json({ message: "roleId and menuId are required." });
        }

        // 1. Verificar si la asignación ya existe
        const existingAssignment = await RoleMenu.findOne({ roleId, menuId });
        if (existingAssignment) {
            return res.status(400).json({ message: "This menu is already assigned to this role." });
        }

        // 2. Opcional: Verificar que Role y Menu IDs sean válidos antes de crear
        const roleExists = await Role.findById(roleId);
        const menuExists = await Menu.findById(menuId);

        if (!roleExists || !menuExists) {
            return res.status(404).json({ message: "One or both IDs (Role or Menu) are invalid or not found." });
        }

        // 3. Crear el enlace
        const newAssignment = await RoleMenu.create({ roleId, menuId });

        res.status(201).json({
            message: "Menu assigned to role successfully.",
            assignment: newAssignment
        });
    } catch (error) {
        console.error("Error assigning menu to role:", error);
        res.status(500).json({ message: "Server error assigning menu." });
    }
};

// --- Función 2: Revocar un Menú de un Rol (Delete / Revoke) ---
// DELETE /role-menus/:roleId/:menuId
exports.revokeMenuFromRole = async (req, res) => {
    try {
        const { roleId, menuId } = req.params;

        if (!roleId || !menuId) {
            return res.status(400).json({ message: "roleId and menuId must be provided in the URL." });
        }

        // 1. Eliminar el enlace
        const result = await RoleMenu.deleteOne({ roleId, menuId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Assignment not found." });
        }

        res.json({ message: "Menu permission revoked from role successfully." });
    } catch (error) {
        console.error("Error revoking menu from role:", error);
        res.status(500).json({ message: "Server error revoking menu." });
    }
};

// --- Función 3: Obtener Menús Asignados a un Rol (Read By Role) ---
// GET /role-menus/:roleId
exports.getMenusByRole = async (req, res) => {
    try {
        const roleId = req.params.roleId;

        // 1. Encontrar todos los enlaces para ese Role
        const assignments = await RoleMenu.find({ roleId }).populate('menuId');

        // 2. Mapear para devolver solo los detalles del menú
        const menus = assignments.map(a => a.menuId).filter(menu => menu !== null);

        res.json(menus);
    } catch (error) {
        console.error("Error fetching menus by role:", error);
        res.status(500).json({ message: "Server error fetching menus by role." });
    }
};