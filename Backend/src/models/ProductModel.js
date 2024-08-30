const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
     regularprice:{
      type:Number,
      required:true
  },
  images: {
    type: String,
    required: true
  },
  sizes: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1 
    }
  }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
