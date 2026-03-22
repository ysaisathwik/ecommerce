const Review = require("../models/Review");
const Product = require("../models/Product");

/* =========================
   HELPER: UPDATE PRODUCT RATING
========================= */
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
    return;
  }

  const avg =
    reviews.reduce((acc, r) => acc + r.rating, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(productId, {
    rating: avg.toFixed(1),
    numReviews: reviews.length,
  });
};

/* =========================
   ADD REVIEW
========================= */
exports.addReview = async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;

    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = new Review({
      productId,
      userId,
      userName,
      rating,
      comment,
    });

    const saved = await review.save();

    // ⭐ UPDATE PRODUCT
    await updateProductRating(productId);

    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET REVIEWS
========================= */
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE REVIEW
========================= */
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    const updated = await review.save();

    // ⭐ UPDATE PRODUCT
    await updateProductRating(review.productId);

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE REVIEW
========================= */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.productId;

    await review.deleteOne();

    // ⭐ UPDATE PRODUCT
    await updateProductRating(productId);

    res.json({ message: "Review deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};