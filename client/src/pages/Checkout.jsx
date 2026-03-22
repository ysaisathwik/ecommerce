import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function Checkout() {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  // ✅ UPDATED FORM (matches backend schema)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
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

    // ✅ VALIDATION UPDATED
    if (
      !form.name ||
      !form.phone ||
      !form.addressLine ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      // ✅ FIX: map cart to backend format
      const formattedItems = cart.map((item) => ({
        productId: item._id || item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id || "guest123",
          items: formattedItems,
          totalAmount: totalPrice,
          address: form, // ✅ matches backend
          paymentMethod: "COD",
        }),
      });

      const data = await response.json();
      console.log("Order saved:", data);

      if (!response.ok) {
        throw new Error(data.message || "Order failed");
      }

      clearCart();
      navigate("/success");

    } catch (error) {
      console.error("Order failed:", error);
      alert(error.message || "Something went wrong");
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
        {/* FORM */}
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
            name="phone"
            placeholder="Phone"
            className="form-control mb-3"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="addressLine"
            placeholder="Address"
            className="form-control mb-3"
            value={form.addressLine}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            className="form-control mb-3"
            value={form.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            className="form-control mb-3"
            value={form.pincode}
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

        {/* SUMMARY */}
        <div className="col-md-6">
          <h4>Order Summary</h4>

          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            cart.map((item) => (
              <div key={item._id || item.id} className="mb-2">
                {item.title} x {item.quantity} = ₹
                {(item.price * item.quantity).toFixed(2)}
              </div>
            ))
          )}

          <h5 className="mt-3">
            Total: ₹{totalPrice.toFixed(2)}
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Checkout;