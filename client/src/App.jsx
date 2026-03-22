import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

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
   ADMIN ROUTE (FIXED)
========================= */
function AdminRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <p className="text-center mt-5">Loading...</p>;

  // 🔥 wait until metadata loads
  if (!user?.unsafeMetadata?.role) {
    return <p className="text-center mt-5">Checking role...</p>;
  }

  if (user.unsafeMetadata.role !== "admin") {
    return <h3 className="text-center mt-5">Access Denied</h3>;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* 🔥 CLERK REDIRECT AFTER LOGIN */}
        <Route path="/redirect" element={<RedirectBasedOnRole />} />

        {/* ROLE SELECTION */}
        <Route path="/select-role" element={<RoleSelection />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}
        <Route
          path="/products"
          element={
            <UserRoute>
              <Products />
            </UserRoute>
          }
        />
        <Route path="/wishlist" element={<UserRoute>
             <WishlistPage />
            </UserRoute>} /> 
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

        {/* ADMIN ROUTES */}
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

        {/* FALLBACK */}
        <Route
          path="*"
          element={<h2 className="text-center mt-5">Page Not Found</h2>}
        />

      </Routes>

      <Chatbot />
    </Router>
  );
}

export default App;