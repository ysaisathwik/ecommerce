const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const router = express.Router();

// Get user's wishlist
router.get("/:userId", getWishlist);

// Add item to wishlist
router.post("/add", addToWishlist);

// Remove item from wishlist
router.post("/remove", removeFromWishlist);

module.exports = router;