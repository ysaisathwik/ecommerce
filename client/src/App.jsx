import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Checkout from "./pages/Checkout";
import Chatbot from "./components/Chatbot";
import Success from "./pages/Success";
import OrdersPage from "./pages/OrdersPage";
import ProductDetails from "./pages/ProductDetails";
function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="*" element={<h2 className="text-center mt-5">Page Not Found</h2>} />

      </Routes>

      {/* Chatbot always visible */}
      <Chatbot />
    </Router>
  );
}

export default App;