const Wishlist = require("../models/Wishlist");

// GET user's wishlist
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId });
    res.status(200).json({ success: true, items: wishlist?.items || [] });
  } catch (err) {
    console.error("Wishlist fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, product } = req.body;
    if (!userId || !product?.productId) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [product] });
    } else {
      // avoid duplicates
      if (!wishlist.items.some(item => item.productId === product.productId)) {
        wishlist.items.push(product);
      }
    }

    await wishlist.save();
    res.status(200).json({ success: true, items: wishlist.items });
  } catch (err) {
    console.error("Add wishlist error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// REMOVE item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ message: "Invalid data" });

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(item => item.productId !== productId);
    await wishlist.save();

    res.status(200).json({ success: true, items: wishlist.items });
  } catch (err) {
    console.error("Remove wishlist error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };