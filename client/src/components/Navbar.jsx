import { Link } from "react-router-dom";
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { isSignedIn } = useUser();
  const { totalItems } = useContext(CartContext);

  return (
    <nav className="navbar navbar-dark bg-dark px-4">

      <Link to="/" className="navbar-brand">MyStore</Link>

      <div className="ms-auto d-flex gap-3 align-items-center">

        <Link to="/" className="btn btn-outline-light">
          Home
        </Link>

        <Link to="/products" className="btn btn-outline-light">
          Products
        </Link>

        {/* ✅ Show only when logged in */}
        {isSignedIn && (
          <>
            <Link to="/cart" className="btn btn-outline-light">
              Cart ({totalItems})
            </Link>

            {/* 🔥 NEW: Orders Button */}
            <Link to="/orders" className="btn btn-outline-info">
              My Orders
            </Link>
          </>
        )}

        {/* Auth Buttons */}
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <>
            <SignInButton>
              <button className="btn btn-outline-light">Login</button>
            </SignInButton>

            <SignUpButton>
              <button className="btn btn-warning">Signup</button>
            </SignUpButton>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;