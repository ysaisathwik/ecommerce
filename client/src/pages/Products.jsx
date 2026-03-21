import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { FaSearch, FaTag, FaDollarSign } from "react-icons/fa";

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All");

  /* =========================
     FETCH PRODUCTS
  ========================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched products:", data);
       const updated = (data || []).map(p => ({
  ...p,
  id: p._id   // 🔥 normalize here
}));

setProducts(updated);
setFiltered(updated);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setFiltered([]);
      });
  }, []);

  /* =========================
     APPLY FILTERS
  ========================= */
  useEffect(() => {
    let temp = [...products];

    // 🔍 SEARCH (SAFE)
    if (search) {
      temp = temp.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🏷 CATEGORY (CASE SAFE)
    if (category !== "All") {
      temp = temp.filter(p =>
        p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // 💰 PRICE
    if (price !== "All") {
      if (price === "low") temp = temp.filter(p => p.price < 100);
      if (price === "mid")
        temp = temp.filter(p => p.price >= 100 && p.price <= 500);
      if (price === "high") temp = temp.filter(p => p.price > 500);
    }

    setFiltered(temp);
  }, [search, category, price, products]);

  return (
    <div className="container mt-4">

      <h2 className="mb-3">Products</h2>

      {/* 🔍 SEARCH */}
      <div className="input-group mb-3">
        <span className="input-group-text bg-dark text-white">
          <FaSearch />
        </span>
        <input
          type="text"
          placeholder="Search products..."
          className="form-control"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🏷 FILTERS */}
      <div className="row mb-4">

        {/* Category */}
        <div className="col-md-6 mb-2">
          <div className="input-group">
            <span className="input-group-text bg-dark text-white">
              <FaTag />
            </span>
            <select
              className="form-select"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="col-md-6 mb-2">
          <div className="input-group">
            <span className="input-group-text bg-dark text-white">
              <FaDollarSign />
            </span>
            <select
              className="form-select"
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="All">All Prices</option>
              <option value="low">Below $100</option>
              <option value="mid">$100 - $500</option>
              <option value="high">Above $500</option>
            </select>
          </div>
        </div>

      </div>

      {/* 🛍 PRODUCTS */}
      <div className="row">
        {filtered.length === 0 ? (
          <p className="text-center text-danger">
            No products found (check backend /api/products)
          </p>
        ) : (
          filtered.map(product => (
            <div key={product._id || product.id} className="col-md-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Products;