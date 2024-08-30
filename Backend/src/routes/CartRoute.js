const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const verifyToken = require('../middleware/AuthMiddleware');


// Route to add a product to the cart
router.post('/add-to-cart', verifyToken, CartController.addToCart);

// Route to view the user's cart
router.get('/view-cart', verifyToken, CartController.viewCart);

// Route to remove an item from the cart
router.delete('/remove-from-cart/:itemId',  CartController.removeFromCart);

module.exports = router;
