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

        const res = await fetch(
          `http://localhost:5000/api/orders/${userId}`
        );

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isLoaded]);

  // ⏳ loading state
  if (!isLoaded || loading) {
    return <p className="text-center mt-5">Loading orders...</p>;
  }

  // ❌ not logged in
  if (!isSignedIn) {
    return (
      <div className="text-center mt-5">
        <h4>Please login to view your orders</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card p-3 mb-3 shadow-sm">

            <h5>Order ID: {order._id}</h5>

            <p><b>Status:</b> {order.status}</p>
            <p><b>Total:</b> ${order.totalAmount}</p>
            <p>
              <b>Date:</b>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-2">
              <b>Items:</b>
              <ul>
                {order.items?.map((item, index) => (
                  <li key={index}>
                    {item.title} x {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default OrdersPage;