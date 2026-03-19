
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {

  const { cart, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = () => {
    if (!form.name || !form.address || !form.phone) {
      alert("Please fill all fields");
      return;
    }

    // simulate order success
    navigate("/success");
  };

  return (
    <div className="container mt-4">

      <h2>Checkout</h2>

      <div className="row">

        {/* Form */}
        <div className="col-md-6">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="form-control mb-3"
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            className="form-control mb-3"
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="form-control mb-3"
            onChange={handleChange}
          />

          <button className="btn btn-success" onClick={handleOrder}>
            Place Order
          </button>

        </div>

        {/* Summary */}
        <div className="col-md-6">

          <h4>Order Summary</h4>

          {cart.map((item) => (
            <div key={item.id}>
              {item.title} x {item.quantity}
            </div>
          ))}

          <h5 className="mt-3">
            Total: ${totalPrice.toFixed(2)}
          </h5>

        </div>

      </div>

    </div>
  );
}

export default Checkout;