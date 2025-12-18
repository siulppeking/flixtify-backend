const UserRole = require('../models/UserRole');
const Role = require('../models/Role');

const checkAdmin = async (req, res, next) => {
  try {
    const activeRoleId = req.user.activeRoleId;

    if (!activeRoleId) {
      return res.status(403).json({ message: 'Access denied: No active role found.' });
    }

    // Verify active role is ADMIN
    const activeRole = await Role.findById(activeRoleId);

    if (!activeRole) {
      return res.status(403).json({ message: 'Access denied: Role not recognized.' });
    }

    if (activeRole.name !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied: Requires ADMIN privileges.' });
    }

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ message: 'Authorization verification failed.' });
  }
};

module.exports = checkAdmin;