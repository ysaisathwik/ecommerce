const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Ecommerce API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});