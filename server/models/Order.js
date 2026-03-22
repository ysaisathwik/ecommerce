const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: {
          type: String,
        },
        title: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
        image: {
          type: String, // useful for order history UI
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    // 🏠 ADD ADDRESS (IMPORTANT)
    address: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      addressLine: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },

    // 💳 PAYMENT METHOD
    paymentMethod: {
      type: String,
      default: "COD",
    },

    // 📦 ORDER STATUS (UPGRADED)
    status: {
      type: String,
      enum: ["Pending", "Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);