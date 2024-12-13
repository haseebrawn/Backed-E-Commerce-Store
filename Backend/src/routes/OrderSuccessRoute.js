const express = require('express');
const router = express.Router();

const { getSuccessDetails } = require('../controllers/OrderSuccess');

// Modify the route to accept sessionId as a slug
router.get('/success/:sessionId', getSuccessDetails);

module.exports = router;
