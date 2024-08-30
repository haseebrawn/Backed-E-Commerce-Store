const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison




const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signUp = async (req, res) => {
    try {
      const { username, nameandsurname, email, phone, password, address, country } = req.body;
      const images = req.file;
      
      if (!images) {
        return res.status(400).json({
          status: 'fail',
          message: 'No image uploaded'
        });
      }

      const imagePath = '/uploads/userImages/' + images.filename; // Assuming images are stored in the public/uploads directory
      // Create a new user instance
      const newUser = await User.create({ 
        username, 
        nameandsurname, 
        email, 
        phone, 
        password, 
        address, 
        country, 
        image:imagePath
      });

      // Send token to the client
      createSendToken(newUser, 201, res);
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  };



// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password'
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email }).select('+password'); // Include the password for verification

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Account not found. Please sign up first.'
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Remove the password from the user object
    user.password = undefined;

    // Create and send the token
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};


// Count users

exports.countUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        count: userCount
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from the results
    res.status(200).json({
      status: 'success',
      data: {
        users
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}
// controllers/userController.js
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
