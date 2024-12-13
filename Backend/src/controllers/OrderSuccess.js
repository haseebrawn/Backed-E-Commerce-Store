const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const stripe = require('stripe')(process.env.STRIPE_KEY);
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');

exports.getSuccessDetails = async (req, res) => {
    const { sessionId } = req.params;  // Get sessionId from the route parameters

    if (!sessionId) {
        return res.status(400).json({
            success: false,
            message: "Session ID is required.",
        });
    }

    try {
        // Retrieve the session details from Stripe using the sessionId
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Fetch the paymentIntent using the payment_intent ID from the session
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        // Fetch the order using the sessionId to match the Order in your database
        const order = await Order.findOne({ stripeSessionId: sessionId });

        // If no order is found, return an error
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with the given session ID.",
            });
        }

        // Fetch the product associated with the order (assuming you stored productId in the order)
        const product = await Product.findById(order.productId);

        // Return the success response with payment and product details
        res.status(200).json({
            success: true,
            message: "Payment successful!",
            paymentDetails: {
                customerEmail: session.customer_details.email,
                paymentMethod: paymentIntent.charges.data[0]?.payment_method_details?.card,
                totalAmount: session.amount_total / 100, // Convert to currency unit (PKR or other)
            },
            productDetails: product,
            orderDetails: order,
        });
    } catch (error) {
        console.error("Error fetching success details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch success details.",
            error: error.message,
        });
    }
};
