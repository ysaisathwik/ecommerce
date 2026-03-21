import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  /* =========================
     LOAD CART FROM LOCALSTORAGE
  ========================= */
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      if (savedCart && Array.isArray(savedCart)) {
        setCart(savedCart);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      setCart([]); // ✅ fallback safety
    }
  }, []);

  /* =========================
     SAVE CART TO LOCALSTORAGE
  ========================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = (product) => {
    if (!product?.id) return; // ✅ safety check

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(prev =>
        prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  /* =========================
     INCREASE QUANTITY
  ========================= */
  const increaseQuantity = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /* =========================
     DECREASE QUANTITY
  ========================= */
  const decreaseQuantity = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1
            }
          : item
      )
    );
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  /* =========================
     CLEAR CART
  ========================= */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  /* =========================
     TOTALS (SAFE)
  ========================= */
  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  const totalItems = cart.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}