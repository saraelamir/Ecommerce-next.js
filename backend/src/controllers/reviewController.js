const Review = require("../models/Review");
const Product = require("../models/Product");

exports.createReview = async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { user: req.user._id, product: req.body.productId },
    {
      rating: req.body.rating,
      comment: req.body.comment || "",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const reviews = await Review.find({ product: req.body.productId });
  const averageRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(req.body.productId, {
    averageRating,
    reviewCount: reviews.length,
  });
  res.status(201).json({ review });
};

exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
  res.json({ reviews });
};
