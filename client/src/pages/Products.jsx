import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Chatbot from "../components/Chatbot";
import { FaSearch, FaTag, FaDollarSign } from "react-icons/fa";

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        let productArray = [];

        if (Array.isArray(data)) {
          productArray = data;
        } else if (Array.isArray(data.products)) {
          productArray = data.products;
        }

        const updated = productArray.map((p) => ({
          ...p,
          id: p._id,
        }));

        console.log("FINAL PRODUCTS:", updated);

        setProducts(updated);
        setFiltered(updated);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let temp = [...products];

    if (search) {
      temp = temp.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      temp = temp.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (price !== "All") {
      if (price === "low") temp = temp.filter((p) => p.price < 100);
      if (price === "mid")
        temp = temp.filter((p) => p.price >= 100 && p.price <= 500);
      if (price === "high") temp = temp.filter((p) => p.price > 500);
    }

    setFiltered(temp);
  }, [search, category, price, products]);

  return (
    <div className="container mt-4">

      <h2>Products</h2>

      <div className="input-group mb-3">
        <span className="input-group-text"><FaSearch /></span>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <select className="form-select" onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
          </select>
        </div>

        <div className="col-md-6">
          <select className="form-select" onChange={(e) => setPrice(e.target.value)}>
            <option value="All">All</option>
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="row">
        {filtered.map((product) => (
          <div key={product.id} className="col-md-3 mb-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* ✅ CRITICAL LINE */}
      <Chatbot products={products} />

    </div>
  );
}

export default Products;