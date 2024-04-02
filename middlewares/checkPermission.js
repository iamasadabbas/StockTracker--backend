const { User } = require('../models/userModel');
const { Role } = require('../models/roleModel');
const { Permission } = require('../models/permissionModel');

function checkPermission(action) {
  return async (req, res, next) => {
    try {
      
      const { _Id } = req.user; 

      // Find the user in your database
      const user = await User.findById(_Id).populate('role'); // Assuming your User model has a 'role' field referencing the Role model

      // Check if the user has the necessary permissions
      const role = user.role;

      if (!role) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      // Fetch the permissions associated with the user's role
      const roleWithPermissions = await Role.findById(role).populate('permissions');

      if (!roleWithPermissions) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      const permissions = roleWithPermissions.permissions.name;

      if (!permissions.includes(action)) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      // If the user has the necessary permissions, proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

module.exports = { checkPermission };
