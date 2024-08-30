const Cart = require('../models/CartModel');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; 

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // You may need to handle cart logic here based on your application's requirements
    // For example, you could store the cart in session if not dealing with user authentication

    // Sample logic (this may vary based on your application architecture):
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      const existingItemIndex = cart.items.findIndex(item => item.product == productId);

      if (existingItemIndex !== -1) {
        // If the product already exists in the cart, update its quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
      res.status(200).json({ message: 'Product added to cart successfully' });
    } else {
      // If the user doesn't have a cart yet, create a new cart
      const newCart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }]
      });
      await newCart.save();
      res.status(201).json({ message: 'Product added to cart successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.viewCart = async (req, res) => {
  try {
    const userId = req.user.id; 
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;  
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    cart.items.pull(itemId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
