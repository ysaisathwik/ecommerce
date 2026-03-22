const Order = require("../models/Order");

// ✅ CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, address, paymentMethod } = req.body;

    // 🔴 VALIDATION (IMPORTANT)
    if (!userId || !items || items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ CREATE ORDER OBJECT
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      address,
      paymentMethod: paymentMethod || "COD",
      status: "Placed",
    });

    // ✅ SAVE TO DB
    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while placing order",
    });
  }
};

// ✅ GET USER ORDERS
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔴 VALIDATION
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ FETCH ORDERS
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};