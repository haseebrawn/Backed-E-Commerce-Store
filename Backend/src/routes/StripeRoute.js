const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/StripeController');

router.post('/create-checkout-session', createCheckoutSession);

module.exports = router;
