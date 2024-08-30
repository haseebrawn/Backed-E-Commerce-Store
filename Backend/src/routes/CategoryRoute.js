const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');



// Categories Route
router.get('/category/:categoryType', CategoryController.getProductsByCategoryType);

// Route to get the count of categories
router.get('/category/count', CategoryController.getCategoryCount);


module.exports = router;
