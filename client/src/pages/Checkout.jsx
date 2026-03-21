import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function Checkout() {
  // ✅ FIXED HERE
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const { user, isLoaded } = useUser();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!isLoaded) {
      alert("User loading...");
      return;
    }

    if (!form.name || !form.address || !form.phone) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user?.id || "guest123",
          userName: user?.fullName || form.name,
          email:
            user?.primaryEmailAddress?.emailAddress || "guest@email.com",
          items: cart,
          totalAmount: totalPrice,
          shippingDetails: form
        })
      });

      const data = await response.json();
      console.log("Order saved:", data);

      // ✅ FIXED HERE
      clearCart();

      // redirect
      navigate("/success");

    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <p className="text-center mt-5">Loading user...</p>;
  }

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
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            className="form-control mb-3"
            value={form.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="form-control mb-3"
            value={form.phone}
            onChange={handleChange}
          />

          <button
            className="btn btn-success w-100"
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

        </div>

        {/* Summary */}
        <div className="col-md-6">

          <h4>Order Summary</h4>

          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="mb-2">
                {item.title} x {item.quantity} = $
                {(item.price * item.quantity).toFixed(2)}
              </div>
            ))
          )}

          <h5 className="mt-3">
            Total: ${totalPrice.toFixed(2)}
          </h5>

        </div>

      </div>

    </div>
  );
}

export default Checkout;