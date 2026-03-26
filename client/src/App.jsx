import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";   // 🔥 ADD THIS

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
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductForm from "./pages/AdminProductForm";
import RoleSelection from "./pages/RoleSelection";
import UserRoute from "./components/UserRoute";
import WishlistPage from "./pages/WishlistPage";

/* =========================
   ROLE REDIRECT
========================= */
function RedirectBasedOnRole() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <p className="text-center mt-5">Loading...</p>;
  if (!isSignedIn) return <Navigate to="/login" />;

  const role = user?.unsafeMetadata?.role;

  if (!role) return <Navigate to="/select-role" />;
  if (role === "admin") return <Navigate to="/admin" />;

  return <Navigate to="/products" />;
}

/* =========================
   ADMIN ROUTE
========================= */
function AdminRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <p className="text-center mt-5">Loading...</p>;

  if (!user?.unsafeMetadata?.role) {
    return <p className="text-center mt-5">Checking role...</p>;
  }

  if (user.unsafeMetadata.role !== "admin") {
    return <h3 className="text-center mt-5">Access Denied</h3>;
  }

  return children;
}

/* =========================
   MAIN APP
========================= */
function App() {

  // 🔥 GLOBAL PRODUCTS STATE
  const [products, setProducts] = useState([]);

  // 🔥 FETCH ONCE HERE
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("GLOBAL PRODUCTS:", data);
        setProducts(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Router>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/redirect" element={<RedirectBasedOnRole />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔥 PASS PRODUCTS HERE */}
        <Route
          path="/products"
          element={
            <UserRoute>
              <Products products={products} />
            </UserRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <UserRoute>
              <WishlistPage />
            </UserRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <UserRoute>
              <Cart />
            </UserRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <UserRoute>
              <Checkout />
            </UserRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <UserRoute>
              <OrdersPage />
            </UserRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <UserRoute>
              <ProductDetails />
            </UserRoute>
          }
        />

        <Route path="/success" element={<Success />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/create"
          element={
            <AdminRoute>
              <AdminProductForm />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit/:id"
          element={
            <AdminRoute>
              <AdminProductForm />
            </AdminRoute>
          }
        />

        <Route
          path="*"
          element={<h2 className="text-center mt-5">Page Not Found</h2>}
        />

      </Routes>

      {/* 🔥 PASS PRODUCTS TO CHATBOT */}
      <Chatbot products={products} />

    </Router>
  );
}

export default App;