import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import {Link} from "react-router-dom"
function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card p-3 shadow-sm h-100">
    <Link to={`/product/${product.id || product._id}`}>
      <h5>{product.title}</h5>
    </Link>     
     <p>${product.price}</p>

      <button
        className="btn btn-primary"
        onClick={() => addToCart({...product,id:product._id})}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;