const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: { // ⭐ Clerk user ID
      type: String,
      required: true,
    },
    userName: { // ⭐ Clerk name
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);