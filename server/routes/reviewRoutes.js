const express = require("express");
const router = express.Router();

const {
  addReview,
  getReviewsByProduct,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

router.post("/", addReview);
router.get("/:productId", getReviewsByProduct);

// ⭐ NEW
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;