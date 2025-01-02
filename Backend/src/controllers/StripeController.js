const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // Load environment variables

const stripe = require("stripe")(process.env.STRIPE_KEY);
const nodemailer = require("nodemailer");
const { getSocketInstance } = require("../utils/socket");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel"); // Import User model

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'monte.ullrich@ethereal.email',
      pass: '5pGfUuf4zfRGTDWSmp'
  }
});

exports.createCheckoutSession = async (req, res) => {
  const { userId, productId, sizes, totalPrice } = req.body; // userId provided

  if (!totalPrice || !userId || !productId || !sizes || sizes.length === 0) {
    return res.status(400).json({ error: "All fields (userId, productId, sizes, totalPrice) are required." });
  }

  try {
    // Fetch user's email from User table
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userEmail = user.email;

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: sizes.map((item) => ({
        price_data: {
          currency: "PKR",
          product_data: {
            name: `Product ID: ${productId}`,
            description: `Size: ${item.size}`,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/api/ordersuccess/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SERVER_URL}/cancel`,
    });

    // Save Order to Database
    const order = await Order.create({
      userId, // Attach userId
      productId,
      sizes,
      totalPrice,
      stripeSessionId: session.id,
      status: "pending",
    });

    // Send Email Notifications
    await transporter.sendMail(
      {
        from: "muhhaseeb7889@gmail.com",
        to: userEmail, // Email fetched from User table
        subject: "Order Confirmation",
        text: `Thank you for your order! Your order ID is: ${order._id}.`,
      },
      (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      }
    );

    await transporter.sendMail({
      from: "monte.ullrich@ethereal.email", // Matching authenticated email
      to: userEmail,
      subject: "Order Confirmation",
      text: `Thank you for your order! Your order ID is: ${order._id}.`,
    });

    // Emit Real-Time Notification
    const io = getSocketInstance();
    io.emit("newOrder", {
      orderId: order._id,
      userId,
      productId,
      sizes,
      totalPrice,
      subject: "A new order has been Recieved!",
  });
  

    return res.json({ sessionId: session.id, order });
  } catch (error) {
    console.error("Error creating checkout session", error);
    res.status(500).json({ error: error.message });
  }
};
