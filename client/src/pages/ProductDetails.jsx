import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">

      <div className="row">

        {/* IMAGE */}
        <div className="col-md-6 text-center">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.title}
            className="img-fluid rounded"
          />
        </div>

        {/* DETAILS */}
        <div className="col-md-6">

          <h2>{product.title}</h2>

          <p className="text-muted">{product.category}</p>

          <h4 className="text-success">${product.price}</h4>

          <p className="mt-3">{product.description}</p>

          <p>
            <strong>Stock:</strong> {product.countInStock}
          </p>

          <button
            className="btn btn-primary mt-3"
            onClick={() =>
              addToCart({
                ...product,
                id: product._id   // 🔥 IMPORTANT
              })
            }
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;