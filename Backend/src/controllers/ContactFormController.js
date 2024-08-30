const ContactForm = require('../models/ContactFormModel');

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create a new contact entry
        const newContact = new ContactForm({
            name,
            email,
            message
        });

        await newContact.save();

        res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
