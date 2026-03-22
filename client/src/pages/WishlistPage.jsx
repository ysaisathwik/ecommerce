import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

function WishlistPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!isLoaded || !user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${user.id}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user, isLoaded]);

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });
      const data = await res.json();
      setItems(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoaded || loading) return <p className="text-center mt-5">Loading wishlist...</p>;
  if (!isSignedIn) return <p className="text-center mt-5">Login to view wishlist</p>;

  return (
    <div className="container mt-4">
      <h2>My Wishlist</h2>
      {items.length === 0 ? <p>No items in wishlist</p> : (
        <div className="row">
          {items.map(item => (
            <div key={item.productId} className="col-md-4 mb-3">
              <div className="card p-2 shadow-sm">
                <img src={item.image} alt={item.title} className="w-100" style={{ height: "150px", objectFit: "cover" }} />
                <h5 className="mt-2">{item.title}</h5>
                <p>₹{item.price}</p>
                <button className="btn btn-danger w-100" onClick={() => removeItem(item.productId)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;