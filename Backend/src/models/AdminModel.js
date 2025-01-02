const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    description: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin',
    },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
