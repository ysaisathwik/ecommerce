import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { user, isLoaded, isSignedIn } = useUser();
  const [inWishlist, setInWishlist] = useState(false);

  // Calculate average rating
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? (
          product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : 0;

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const res = await fetch(`http://localhost:5000/api/wishlist/${user.id}`);
        const data = await res.json();
        const exists = data.items.some(
          (item) => item.productId === (product._id || product.id)
        );
        setInWishlist(exists);
      } catch (err) {
        console.error(err);
      }
    };
    checkWishlist();
  }, [user, isLoaded, isSignedIn, product]);

  const toggleWishlist = async () => {
    if (!isLoaded || !isSignedIn) return alert("Login first!");

    try {
      if (inWishlist) {
        // Remove from wishlist
        const res = await fetch("http://localhost:5000/api/wishlist/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId: product._id || product.id }),
        });
        const data = await res.json();
        setInWishlist(false);
      } else {
        // Add to wishlist
        const res = await fetch("http://localhost:5000/api/wishlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            product: {
              productId: product._id || product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              category: product.category || "General",
            },
          }),
        });
        const data = await res.json();
        setInWishlist(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card p-3 shadow-sm h-100 position-relative">
      {/* Wishlist Icon */}
      <div
        className="position-absolute"
        style={{ top: "10px", right: "10px", cursor: "pointer", fontSize: "1.5rem", color: inWishlist ? "red" : "grey" }}
        onClick={toggleWishlist}
      >
        {inWishlist ? <FaHeart /> : <FaRegHeart />}
      </div>

      <Link to={`/product/${product._id || product.id}`}>
        <h5>{product.title}</h5>
      </Link>
      <p>${product.price}</p>
      <p>⭐ {avgRating} ({product.reviews?.length || 0})</p>

      <button
        className="btn btn-primary w-100"
        onClick={() => addToCart({ ...product, id: product._id || product.id })}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;