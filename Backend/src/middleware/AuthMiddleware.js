const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authRoleMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;

    // Determine role-based access
    const isAdminRoute = req.path.startsWith('/api/admin');
    const isUserRoute = req.path.startsWith('/api/users');

    if (isAdminRoute && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: Admins only' });
    }

    if (isUserRoute && user.role !== 'user') {
      return res.status(403).json({ message: 'Access forbidden: Users only' });
    }

    next(); // Proceed if the role is allowed
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error(error); // Debug log for errors
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authRoleMiddleware;
