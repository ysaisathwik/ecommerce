import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import StarRating from "../components/StarRating";
import { useUser } from "@clerk/clerk-react";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useUser();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // ⭐ Edit states
  const [editId, setEditId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  /* =========================
     FETCH PRODUCT + REVIEWS
  ========================= */
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product || data);
        setReviews(data.reviews || []);
      })
      .catch(err => console.error(err));
  }, [id]);

  /* =========================
     ADD REVIEW
  ========================= */
  const handleReviewSubmit = async () => {
    if (!user) return alert("Please login first");
    if (!rating) return alert("Select rating");

    const review = {
      productId: product._id,
      userId: user.id,
      userName: user.fullName,
      rating,
      comment,
    };

    const res = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    const data = await res.json();

    if (res.ok) {
      setReviews([data, ...reviews]);
      setRating(0);
      setComment("");
    } else {
      alert(data.message);
    }
  };

  /* =========================
     DELETE REVIEW
  ========================= */
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/reviews/${id}`, {
      method: "DELETE",
    });

    setReviews(reviews.filter(r => r._id !== id));
  };

  /* =========================
     EDIT REVIEW
  ========================= */
  const handleEdit = (review) => {
    setEditId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async () => {
    const res = await fetch(
      `http://localhost:5000/api/reviews/${editId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment,
        }),
      }
    );

    const updated = await res.json();

    setReviews(reviews.map(r => (r._id === editId ? updated : r)));
    setEditId(null);
  };

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  /* =========================
     AVERAGE RATING
  ========================= */
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

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

          <p>⭐ {avgRating} / 5 ({reviews.length} reviews)</p>

          <p className="text-muted">{product.category}</p>

          <h4 className="text-success">${product.price}</h4>

          <p>{product.description}</p>

          <button
            className="btn btn-primary"
            onClick={() =>
              addToCart({ ...product, id: product._id })
            }
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* ⭐ ADD REVIEW */}
      <div className="mt-5">
        <h4>Add Review</h4>

        <StarRating rating={rating} setRating={setRating} />

        <textarea
          className="form-control mt-2"
          placeholder="Write review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="btn btn-success mt-2"
          onClick={handleReviewSubmit}
        >
          Submit Review
        </button>
      </div>

      {/* ⭐ SHOW REVIEWS */}
      <div className="mt-4">
        <h4>Reviews</h4>

        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border p-3 mb-2 rounded">

              <strong>{r.userName}</strong>

              {editId === r._id ? (
                <>
                  <StarRating rating={editRating} setRating={setEditRating} />

                  <textarea
                    className="form-control mt-2"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />

                  <button
                    className="btn btn-success mt-2 me-2"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>

                  <button
                    className="btn btn-secondary mt-2"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div>{"⭐".repeat(r.rating)}</div>
                  <p>{r.comment}</p>

                  {/* ✅ Only show for logged-in user */}
                  {user && user.id === r.userId && (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(r)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(r._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default ProductDetails;