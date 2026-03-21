const Order = require("../models/Order");

/* CREATE ORDER */
const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    const order = new Order({
      userId,
      items,
      totalAmount,
    });

    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

/* GET USER ORDERS */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};