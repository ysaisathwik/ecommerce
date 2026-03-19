import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function Success() {
  return (
    <div className="container mt-5 text-center">

      {/* Success Icon */}
    <FaCheckCircle
  className="mb-3"
  style={{
    color: "green",
    fontSize: "80px",
    transition: "0.3s"
  }}
/>

      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your purchase.</p>

      <Link to="/products" className="btn btn-primary mt-3">
        Continue Shopping
      </Link>

    </div>
  );
}

export default Success;