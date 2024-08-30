const express= require('express');
const router = express.Router();
const multer = require("multer");
const UserController = require('../controllers/UserController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/userImages"); // Destination folder where images will be saved
    },
    filename: (req, file, cb) => {
      // Replace backslashes with forward slashes in the file path
      const filename = `${Date.now()}${file.originalname}`;
      cb(null, filename); // Rename the file with a unique name
    },
  });
  
  const upload = multer({ storage: storage });

// User Route
router.post('/signUP',upload.single("image"), UserController.signUp);
router.post('/login', UserController.login);
router.get('/countUser', UserController.countUsers);
router.get('/getAlluser', UserController.getAllUser);
router.get('/:id', UserController.getUserById);


module.exports= router;
