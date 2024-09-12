const Review = require('../models/ReviewModel');

exports.createReview = async (req, res) => {
    const { name, email, rating, title, review } = req.body;
    const media = req.file ? req.file.filename : null; // If using multer for file upload
  
    try {
      // Create a new review
      const newReview = new Review({
        name,
        email,
        rating,
        title,
        review,
        media,
      });
  
      // Save the review to the database
      const savedReview = await newReview.save();
  
      res.json(savedReview);
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  

exports.getReview = async (req, res) => {
  try {
  //  const {id} = req.params;
    const reviews = await Review.find();
    res.status(200).json({
      status: 'success',
      data: {
        review: reviews
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};