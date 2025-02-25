const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id; // ID пользователя из токена

  try {
    const review = new Review({ userId, productId, rating, comment });
    await review.save();

    
    await Product.findByIdAndUpdate(productId, { $push: { reviews: review._id } });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: "Failed to create review", error });
  }
};

exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId }).populate("userId", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};