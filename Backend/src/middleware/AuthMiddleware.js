const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const verifyToken = async (req, res, next) => {
  try {
    // Check if token is provided in the headers
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract token from the header
    const tokenString = token.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

    // Fetch user based on the decoded token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user object to the request
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = verifyToken;
