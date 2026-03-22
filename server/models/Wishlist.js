const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        title: String,
        price: Number,
        image: String,
        category: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);