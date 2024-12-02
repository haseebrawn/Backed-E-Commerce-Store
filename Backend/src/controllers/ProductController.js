const slugify = require('slugify');
const Product = require('../models/ProductModel');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, regularprice } = req.body;
    const images = req.file;

    // Ensure required fields are present
    if (!name || !description || !price || !category || !regularprice || !images || !req.body.sizes) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse sizes JSON string into an array of objects
    let parsedSizes = [];
    try {
      parsedSizes = JSON.parse(req.body.sizes);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid sizes format' });
    }

    // Validate parsed sizes
    if (!Array.isArray(parsedSizes) || parsedSizes.some(size => !size.name || size.quantity <= 0)) {
      return res.status(400).json({ message: 'Invalid sizes data' });
    }

    // Generate a slug from the product name
    let slug = slugify(name, { lower: true, strict: true });

    // Check if the slug already exists
    let existingProduct = await Product.findOne({ slug });
    let counter = 1;

    // If the slug exists, make it unique by appending a number to it
    while (existingProduct) {
      slug = `${slugify(name, { lower: true, strict: true })}-${counter}`;
      existingProduct = await Product.findOne({ slug });
      counter++;
    }

    // Save the image path to the database
    const imagePath = '/uploads/productImages/' + images.filename;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      regularprice,
      images: imagePath,
      sizes: parsedSizes,
      slug,  // Add the generated slug to the product
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // res.json(products);
    res.status(200).json({
      status: 'success',
      data: {
        product: products
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// New function to get the count of products
exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    // console.log("CountProduct", count);
    res.status(200).json({
      status: 'success',
      data: {
        count: count
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// // controllers/userController.js
// exports.getProductByName = async (req, res) => {
//   try {
//     const product = await Product.findOne({ name: req.params.name.toLowerCase() });
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json({ data: product });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ data: { product } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

