const Product = require("../models/Product");
const Review = require("../models/Review");
/* =========================
   GET ALL PRODUCTS
========================= */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   GET PRODUCT BY ID
========================= */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const reviews = await Review.find({
        productId: req.params.id,
      });

      res.json({
        product,
        reviews,
      });

    } else {
      res.status(404).json({ message: "Product Not Found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   CREATE PRODUCT
========================= */
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, countInStock } = req.body; // ✅ FIXED

    const product = new Product({
      title, // ✅ FIXED
      description,
      price,
      category,
      image,
      countInStock
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = req.body.title || product.title; // ✅ FIXED
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.image = req.body.image || product.image;
      product.countInStock = req.body.countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);

    } else {
      res.status(404).json({ message: "Product Not Found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

/* =========================
   DELETE PRODUCT
========================= */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
exports.fixRatings = async (req, res) => {
  try {
    const Product = require("../models/Product");
    const Review = require("../models/Review");

    const products = await Product.find();

    for (let product of products) {
      const reviews = await Review.find({ productId: product._id });

      if (reviews.length === 0) {
        product.rating = 0;
        product.numReviews = 0;
      } else {
        const avg =
          reviews.reduce((acc, r) => acc + r.rating, 0) /
          reviews.length;

        product.rating = avg.toFixed(1);
        product.numReviews = reviews.length;
      }

      await product.save();
    }

    res.json({ message: "Ratings fixed successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};