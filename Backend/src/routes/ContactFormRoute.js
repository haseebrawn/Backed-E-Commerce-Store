const express = require('express');
const router = express.Router();
const ContactFormController= require('../controllers/ContactFormController');

// POST route to handle form submission
router.post('/submitForm', ContactFormController.submitContactForm);

module.exports = router;
