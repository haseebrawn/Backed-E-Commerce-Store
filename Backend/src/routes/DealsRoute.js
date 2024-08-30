const express = require('express');
const router = express.Router();
const multer = require('multer');
const DealsController = require('../controllers/DealsController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/"); // Destination folder where images will be saved
    },
    filename: (req, file, cb) => {
      // Replace backslashes with forward slashes in the file path
      const filename = `${Date.now()}${file.originalname}`;
      cb(null, filename); // Rename the file with a unique name
    },
  });
  
  const upload = multer({ storage: storage });
  
// Deals Route
router.post('/deals', upload.single("images"), DealsController.createBundleDeal);
// Route to get the count of deals
router.get('/countDeal', DealsController.getDealCount); 

module.exports = router;
