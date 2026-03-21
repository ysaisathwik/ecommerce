const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: String
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  }
});

const productSchema = new mongoose.Schema(
  {
    title: {  
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    image: {
      type: String
    },

    countInStock: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    },

    reviews: [reviewSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema); 