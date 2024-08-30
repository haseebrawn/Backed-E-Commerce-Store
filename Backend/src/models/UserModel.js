const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  image: {
    type: String,
    required:true
  },
  username: {
    type: String,
    required: [true, "Please provide your username"],
  },
  nameandsurname: {
    type: String,
    required: [true, "Please provide your name and surname"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    unique:true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  address: {
    type: String,
    required: [true, "Please provide your address"],
  },
  country: {
    type: String,
    required: [true, "Please provide your country"],
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it's modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
