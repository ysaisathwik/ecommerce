import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

function OrdersPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoaded) return;

      try {
        const userId = user?.id;
        if (!userId) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/orders/${userId}`);
        const data = await res.json();

        // IMPORTANT: use data.orders
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isLoaded]);

  if (!isLoaded || loading) return <p className="text-center mt-5">Loading orders...</p>;

  if (!isSignedIn) {
    return <div className="text-center mt-5"><h4>Please login to view your orders</h4></div>;
  }

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card p-3 mb-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Order ID: {order._id}</h5>
              <span className={`badge bg-${
                order.status === "Pending" ? "warning" :
                order.status === "Placed" ? "primary" :
                order.status === "Shipped" ? "info" :
                order.status === "Delivered" ? "success" :
                "danger"
              }`}>{order.status}</span>
            </div>

            <p className="mb-1"><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
            <p className="mb-2"><b>Total:</b> ₹{order.totalAmount.toFixed(2)}</p>

            <div>
              <b>Items:</b>
              <div className="row mt-2">
                {order.items?.map((item, index) => (
                  <div key={index} className="col-md-6 mb-2 d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="me-2"
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                    />
                    <div>
                      <div>{item.title}</div>
                      <small>Qty: {item.quantity} | ₹{(item.price * item.quantity).toFixed(2)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;