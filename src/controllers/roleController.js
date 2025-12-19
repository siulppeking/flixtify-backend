const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const RoleMenu = require('../models/RoleMenu');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Server error fetching roles' });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ message: 'Server error fetching role' });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'A role with this name already exists' });
    }

    const newRole = await Role.create({ name, description });
    res.status(201).json({
      message: 'Role created successfully',
      role: newRole
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Server error creating role' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found for update' });
    }

    res.json({
      message: 'Role updated successfully',
      role: updatedRole
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Server error updating role' });
  }
};

// --- Función 5: Eliminar un rol (Delete) ---
// **IMPORTANTE:** Debe verificar y limpiar las referencias en las tablas de enlace.
exports.deleteRole = async (req, res) => {
    try {
        const roleId = req.params.id;

        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found for deletion." });
        }

        // 1. Verificar si el rol está en uso por algún usuario
        const usersAssigned = await UserRole.countDocuments({ roleId });
        if (usersAssigned > 0) {
            return res.status(400).json({
                message: `Cannot delete role. ${usersAssigned} users are still assigned to this role.`
            });
        }

        // 2. Eliminar todas las relaciones en RoleMenu (permisos de navegación)
        await RoleMenu.deleteMany({ roleId });

        // 3. Eliminar la entidad Role
        await Role.deleteOne({ _id: roleId });

        res.json({
            message: "Role and all its associated menu permissions deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ message: "Server error deleting role." });
    }
};