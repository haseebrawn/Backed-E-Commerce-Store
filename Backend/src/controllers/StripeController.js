const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // Load environment variables

const stripe = require('stripe')(process.env.STRIPE_KEY);
const Product = require('../models/ProductModel');

exports.createCheckoutSession = async (req, res) => {
    const { productId, sizes, total } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: sizes.map((item) => ({
        price_data: {
          currency: "PKR",
          product_data: {
            name: `Product ID: ${productId}`,
            description: `Size: ${item.size}`,
          },
          unit_amount: total * 100, // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.SERVER_URL}/success`,
      cancel_url: `${process.env.SERVER_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session", error);
    res.status(500).json({ error: error.message });
  }
};






















// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' }); // Load environment variables

// const stripe = require('stripe')(process.env.STRIPE_KEY);


// exports.createCheckoutSession = async (req, res) => {
//     try {
//         const { productId, sizes, amount } = req.body;
        

//         const session = await stripe.checkout.sessions.create({
//             line_items: [
//                 {
//                     price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: 'Navy Cargo Shorts',
//                     },
//                     unit_amount: 2000,
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             success_url: `${process.env.SERVER_URL}/checkout/success`,
//             cancel_url: `${process.env.SERVER_URL}/checkout/cancel`,
//         });

//         res.redirect(303, session.url);
//     } catch (error) {
//         console.error('Error in Stripe Controller:', error.message); // Error log
//         res.status(500).json({ error: error.message });
//     }
// };
