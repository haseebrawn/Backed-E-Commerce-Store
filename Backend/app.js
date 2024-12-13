const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./src/routes/ProductRoute');
const categoryRoutes = require('./src/routes/CategoryRoute');
const reviewRoutes = require('./src/routes/ReviewRoute');
const dealRoutes = require('./src/routes/DealsRoute');
const userRoutes = require('./src/routes/UserRoute');
const cartRoutes = require('./src/routes/CartRoute');
const orderRoutes = require('./src/routes/OrderRoute');
const contactFormRoutes = require('./src/routes/ContactFormRoute');
const stripeRoutes = require ('./src/routes/StripeRoute');
const orderSuccessRoutes = require('./src/routes/OrderSuccessRoute');
const app = express();
const cors = require('cors');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// product Route
app.use('/api/product', productRoutes);
// Order Route
app.use('/api/order', orderRoutes);
// category Route
app.use('/api/product', categoryRoutes);
// review Route
app.use('/api/review', reviewRoutes);
// Bundle Deals Route
app.use('/api/deal', dealRoutes);
// user Route
app.use('/api/users', userRoutes);
// cart Route
app.use('/api/cart', cartRoutes); 
// Contact Form Route
app.use('/api/contactform', contactFormRoutes);
// Stripe Routes
app.use('/api/stripe', stripeRoutes);

// OrderSuccess Route 
app.use('/api/ordersuccess', orderSuccessRoutes);


app.use("/uploads", express.static("uploads"));


module.exports = app;
