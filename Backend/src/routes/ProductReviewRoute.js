const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');


// Product reviews
router.get('/product-reviews/:productId', ReviewController.getProductReviews);
router.post('/product-reviews/:productId', ReviewController.createProductReview);


module.exports = router;
