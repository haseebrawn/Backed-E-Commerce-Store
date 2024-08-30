const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

exports.createOrder = async (req, res) => {
  try {
    const { productId, sizes } = req.body;

    // Ensure required fields are present
    if (!productId || !sizes || !Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the product
    const foundProduct = await Product.findById(productId);
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let totalPrice = 0;
    let updatedSizes = foundProduct.sizes.map((ps) => {
      const orderSize = sizes.find((size) => size.size === ps.name);
      if (orderSize) {
        if (orderSize.quantity > ps.quantity) {
          throw new Error(`Insufficient quantity for size ${ps.name}`);
        }
        // Calculate total price based on size price and quantity
        totalPrice += (ps.price || 0) * orderSize.quantity;
        // Reduce the quantity in the product
        ps.quantity -= orderSize.quantity;
      }
      return ps;
    });
    updatedSizes = updatedSizes.filter((size) => size.quantity > 0);
    // Create the order
    const newOrder = new Order({
      productId,
      quantity: sizes.reduce((acc, size) => acc + size.quantity, 0),
      totalPrice,
      sizes,
    });

    // Save the updated product
    foundProduct.sizes = updatedSizes;
    await foundProduct.save();
    // Save the order to the database
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from the authenticated user

    // Fetch orders for the authenticated user
    const orders = await Order.find({ userId }).populate({
      path: 'productId',
      select: 'name description price category images',
    });

    // Add tracking ID and customer name to each order
    const ordersWithTrackingId = orders.map(order => ({
      ...order._doc, // Spread the order document
      trackingId: `TRACK-${order._id.toString().slice(-8)}`, // Generate tracking ID based on order ID
      customer: req.user.name // Add customer name from logged-in user
    }));

    res.status(200).json({
      status: 'success',
      data: ordersWithTrackingId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }
};

// Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    // Find all orders and populate the product details
    const orders = await Order.find().populate({
      path: "productId",
      select: "name description price category images sizes",
    });

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      productId: {
        _id: order.productId._id,
        name: order.productId.name,
        description: order.productId.description,
        price: order.productId.price,
        category: order.productId.category,
        images: order.productId.images,
        sizes: order.sizes,
      },
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      status: order.status,
    }));

    res.status(200).json({
      status: "success",
      data: {
        orders: formattedOrders,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.getById;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Count all Orders
exports.countOrder = async (req, res) => {
  try {
    // Get the total count of orders
    const count = await Order.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        count
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Server error'
    });
  }
};
