import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function AdminDashboard() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  return (
    <div className="container mt-4">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>

        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => (window.location.href = "/admin/create")}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Product List */}
      {products.map((p) => (
        <div
          key={p._id}
          className="card p-3 mb-3 shadow-sm d-flex flex-row justify-content-between align-items-center"
        >
          {/* Product Info */}
          <div>
            <h5 className="mb-1">{p.title}</h5>
            <p className="mb-0 text-muted">${p.price}</p>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-warning d-flex align-items-center gap-1"
              onClick={() =>
                (window.location.href = `/admin/edit/${p._id}`)
              }
            >
              <FaEdit /> Edit
            </button>

            <button
              className="btn btn-sm btn-danger d-flex align-items-center gap-1"
              onClick={() => deleteProduct(p._id)}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;