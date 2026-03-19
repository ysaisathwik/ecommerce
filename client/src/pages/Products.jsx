import ProductCard from "../components/ProductCard";

const products = [
  { id: 1, title: "Laptop", price: 800, image: "https://via.placeholder.com/200" },
  { id: 2, title: "Phone", price: 500, image: "https://via.placeholder.com/200" },
  { id: 3, title: "Headphones", price: 100, image: "https://via.placeholder.com/200" },
  { id: 4, title: "Smart Watch", price: 250, image: "https://via.placeholder.com/200" }
];

function Products() {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Products</h2>

      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 mb-4" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

    </div>
  );
}

export default Products;