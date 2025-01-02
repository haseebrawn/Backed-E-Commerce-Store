const express = require('express');
const multer = require("multer");
const { createProfile, getProfile, updateProfile, deleteProfile } = require('../controllers/AdminController');
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/adminImages"); // Destination folder where images will be saved
    },
    filename: (req, file, cb) => {
      // Replace backslashes with forward slashes in the file path
      const filename = `${Date.now()}${file.originalname}`;
      cb(null, filename); // Rename the file with a unique name
    },
  });
  
  const upload = multer({ storage: storage });

// Admin Routes
router.post('/',upload.single('profileImage'), createProfile); // Create admin profile
router.get('/:id', getProfile); // Get admin profile by ID
router.put('/:id', updateProfile); // Update admin profile
router.delete('/:id', deleteProfile); // Delete admin profile

module.exports = router;
