const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // Load environment variables

const stripe = require('stripe')(process.env.STRIPE_KEY);
const Order = require('../models/OrderModel');

exports.createCheckoutSession = async (req, res) => {
    const { productId, sizes, totalPrice } = req.body; // Ensure totalPrice is destructured

    if (!totalPrice) {
        return res.status(400).json({ error: "Total Price is required" });
    }

    try {
        // Create the Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: sizes.map((item) => ({
                price_data: {
                    currency: "PKR",
                    product_data: {
                        name: `Product ID: ${productId}`,
                        description: `Size: ${item.size}`,
                    },
                    unit_amount: totalPrice * 100, // Convert to cents
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/api/ordersuccess/success?sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.SERVER_URL}/cancel`,
        });

        // Save the order to the database, including the sessionId
        const order = await Order.create({
            productId,
            sizes,
            totalPrice,
            stripeSessionId: session.id, // Save the sessionId here
            status: 'pending', // Default status
        });

        // Return the session ID and the created order
        return res.json({ sessionId: session.id, order });
    } catch (error) {
        console.error("Error creating checkout session", error);
        res.status(500).json({ error: error.message });
    }
};
