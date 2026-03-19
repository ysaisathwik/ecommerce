import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card p-3 shadow-sm h-100">
      <h5>{product.title}</h5>
      <p>${product.price}</p>

      <button
        className="btn btn-primary"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;