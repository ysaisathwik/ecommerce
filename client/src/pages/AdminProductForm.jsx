import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    countInStock: "",
  });

  /* =========================
     LOAD PRODUCT (EDIT MODE)
  ========================= */
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          const product = data.product || data;

          setForm({
            title: product.title || "",
            price: product.price || "",
            description: product.description || "",
            category: product.category || "",
            image: product.image || "",
            countInStock: product.countInStock || "",
          });
        })
        .catch(err => console.error("Fetch error:", err));
    }
  }, [id]);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = id ? "PUT" : "POST";

      const url = id
        ? `http://localhost:5000/api/products/${id}`
        : `http://localhost:5000/api/products`;

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        image: form.image,
        price: Number(form.price),              // 🔥 FIX
        countInStock: Number(form.countInStock) // 🔥 FIX
      };

      console.log("SENDING:", payload); // 🔥 DEBUG

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("RESPONSE:", data); // 🔥 DEBUG

      if (!res.ok) {
        alert(data.message || "Error saving product");
        return;
      }

      alert(id ? "Product Updated Successfully" : "Product Created Successfully");

      navigate("/admin");

    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Edit Product" : "Create Product"}</h2>

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
        />

        {/* 🔥 FIXED: STOCK INPUT */}
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Stock"
          value={form.countInStock}
          onChange={(e) =>
            setForm({ ...form, countInStock: e.target.value })
          }
        />

        <button className="btn btn-primary">
          {id ? "Update" : "Create"}
        </button>

      </form>
    </div>
  );
}

export default AdminProductForm;