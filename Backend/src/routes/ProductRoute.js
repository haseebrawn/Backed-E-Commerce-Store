const express = require('express');
const router = express.Router();
const multer = require("multer");
const ProductController = require('../controllers/ProductController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/productImages"); // Destination folder where images will be saved
    },
    filename: (req, file, cb) => {
      // Replace backslashes with forward slashes in the file path
      const filename = `${Date.now()}${file.originalname}`;
      cb(null, filename); // Rename the file with a unique name
    },
  });
  
  const upload = multer({ storage: storage });

// Create a new product
router.post('/products', upload.single("images"), ProductController.createProduct);
router.get('/getProducts', ProductController.getAllProducts)
// New route to get the count of products
router.get('/countProduct', ProductController.getProductCount);
router.get('/:id', ProductController.getProductById);

module.exports = router;
