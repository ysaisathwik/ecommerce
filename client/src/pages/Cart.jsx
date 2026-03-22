import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice
  } = useContext(CartContext);

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center">
          <p>No items in cart</p>
          <Link to="/products" className="btn btn-primary mt-2">
            Browse Products
          </Link>
        </div>
      ) : (
        <>

          {cart.map((item) => (
            <div
              key={item.id}
              className="card mb-3 p-3 d-flex flex-row align-items-center shadow-sm"
            >

              {/* Product Info */}
              <div style={{ width: "60%" }}>
                <h6 className="mb-1">{item.title}</h6>
                <p className="mb-0 text-muted">${item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div
                style={{ width: "25%" }}
                className="d-flex justify-content-center align-items-center gap-3"
              >
                <FaMinus
                  style={{ cursor: "pointer" }}
                  onClick={() => decreaseQuantity(item.id)}
                />

                <span className="fw-bold">
                  {item.qty || item.quantity || 1} {/* ✅ FIX */}
                </span>

                <FaPlus
                  style={{ cursor: "pointer" }}
                  onClick={() => increaseQuantity(item.id)}
                />
              </div>

              {/* Delete Icon */}
              <div
                style={{ width: "15%" }}
                className="d-flex justify-content-end"
              >
                <FaTrash
                  style={{
                    cursor: "pointer",
                    color: "red",
                    fontSize: "18px"
                  }}
                  onClick={() => removeFromCart(item.id)}
                />
              </div>

            </div>
          ))}

          {/* Total Price */}
          <div className="text-end mt-4">
            <h4>
              Total Price: ${Number(totalPrice || 0).toFixed(2)}
            </h4>
          </div>

          {/* Checkout Button */}
          <div className="text-end mt-3">
            <Link to="/checkout" className="btn btn-success">
              Proceed to Checkout
            </Link>
          </div>

        </>
      )}
    </div>
  );
}

export default Cart;