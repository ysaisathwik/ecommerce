import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { CartProvider } from "./context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

const PUBLISHABLE_KEY = "pk_test_cmVuZXdlZC1ibHVlZ2lsbC05Ni5jbGVyay5hY2NvdW50cy5kZXYk";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <CartProvider>
        <App />
      </CartProvider>
    </ClerkProvider>
  </React.StrictMode>
);
