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
  const { isSignedIn, user, isLoaded } = useUser();
  const { totalItems } = useContext(CartContext);

  if (!isLoaded) return null;

  const role = user?.unsafeMetadata?.role;

  return (
    <nav className="navbar navbar-dark bg-dark px-4">

      <Link to="/" className="navbar-brand">MyStore</Link>

      <div className="ms-auto d-flex gap-3 align-items-center">

        {/* HOME always */}
        <Link to="/" className="btn btn-outline-light">
          Home
        </Link>

        {/* 👤 USER NAV */}
        {isSignedIn && role === "user" && (
          <>
            <Link to="/products" className="btn btn-outline-light">
              Products
            </Link>

            <Link to="/cart" className="btn btn-outline-light">
              Cart ({totalItems})
            </Link>

            {/* Wishlist icon only for users */}
            <Link to="/wishlist" className="btn btn-outline-light d-flex align-items-center">
              
              Wishlist
            </Link>

            <Link to="/orders" className="btn btn-outline-info">
              My Orders
            </Link>
          </>
        )}

        {/* 👑 ADMIN NAV */}
        {isSignedIn && role === "admin" && (
          <>
            <Link to="/admin" className="btn btn-warning">
              Dashboard
            </Link>

            <Link to="/admin/create" className="btn btn-success">
              Add Product
            </Link>
          </>
        )}

        {/* 🔓 NOT LOGGED IN */}
        {!isSignedIn && (
          <>
            <SignInButton>
              <button className="btn btn-outline-light">Login</button>
            </SignInButton>

            <SignUpButton>
              <button className="btn btn-warning">Signup</button>
            </SignUpButton>
          </>
        )}

        {/* 👤 USER PROFILE */}
        {isSignedIn && <UserButton afterSignOutUrl="/" />}

      </div>
    </nav>
  );
}

export default Navbar;