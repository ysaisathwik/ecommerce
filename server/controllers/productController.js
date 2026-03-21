const Product = require("../models/Product");

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
    const product = await Product.findById(req.params.id); // ✅ FIXED

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" }); // ✅ FIXED
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