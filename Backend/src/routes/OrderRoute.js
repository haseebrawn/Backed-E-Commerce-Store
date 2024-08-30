const express = require('express');
const OrderController = require('../controllers/OrderController');
const verifyToken = require('../middleware/AuthMiddleware');


const router = express.Router();

// Create a new order
router.post('/', OrderController.createOrder);

// Get all orders
router.get('/', OrderController.getAllOrders);

router.get('/user/orders', verifyToken, OrderController.getUserOrders);

// Get All OrderCount
router.get('/orderCount', OrderController.countOrder);

// Get a specific order by ID
router.get('/:id', OrderController.getOrderById);

// Update an order's status
router.patch('/:id', OrderController.updateOrderStatus);

// Delete an order
router.delete('/:id', OrderController.deleteOrder);


module.exports = router;
