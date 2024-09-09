const express = require('express');
const router = express.Router();
const multer = require("multer");
const reviewController = require('../controllers/ReviewController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/reviewImages"); // Destination folder where images will be saved
    },
    filename: (req, file, cb) => {
      // Replace backslashes with forward slashes in the file path
      const filename = `${Date.now()}${file.originalname}`;
      cb(null, filename); // Rename the file with a unique name
    },
  });
  
  const upload = multer({ storage: storage });


// Reviews
// router.get('/getReviews', reviewController.getAllReviews);
router.post('/reviews', upload.single('media'), reviewController.createReview);
router.get('/reviews', reviewController.getReview);

module.exports = router;
