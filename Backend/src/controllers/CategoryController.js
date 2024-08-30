const Product = require('../models/ProductModel');


exports.getProductsByCategoryType = async(req, res) => {
  const categoryType = req.params.categoryType;
    try{

     const products = await Product.find({category: categoryType});

     res.status(200).json({
        status: 'success',
        data: {
          product: products
        }
      });

    }catch (err) {  
     console.log("Data not fetch by Category Type" ,err);
     res.status(500).json({message: "Internal Server Error"})
    }
}


// Function to count unique categories
exports.getCategoryCount = async (req, res) => {
    try {
      const uniqueCategories = await Product.distinct('category');
      const categoryCount = uniqueCategories.length;
  
      res.status(200).json({
        status: 'success',
        data: {
          count: categoryCount
        }
      });
      
    } catch (err) {
      console.error("Failed to count categories", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };




