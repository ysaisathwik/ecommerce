import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  /* =========================
     INITIAL LOAD
  ========================= */
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error loading cart:", err);
      return [];
    }
  });

  /* =========================
     SAVE TO LOCALSTORAGE
  ========================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* =========================
     🔥 SYNC CART WITH BACKEND
  ========================= */
  useEffect(() => {
    const syncCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const products = await res.json();

        setCart((prev) => {
          const updated = prev
            .map((item) => {
              const latest = products.find(
                (p) => (p._id || p.id) === item.id
              );

              if (!latest) return null;

              return {
                ...item,
                price: latest.price,
                title: latest.title,
                image: latest.image,
              };
            })
            .filter(Boolean);

          return updated;
        });

      } catch (err) {
        console.error("Cart sync error:", err);
      }
    };

    syncCart();
  }, []);

  /* =========================
     🔥 ADD TO CART (FIXED)
  ========================= */
  const addToCart = (product) => {
    if (!product) return;

    const id = product.id || product._id;

    if (!id) {
      console.error("❌ Product missing ID");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);

      if (existing) {
        return prev.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  /* =========================
     INCREASE
  ========================= */
  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /* =========================
     DECREASE
  ========================= */
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            }
          : item
      )
    );
  };

  /* =========================
     REMOVE
  ========================= */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* =========================
     CLEAR
  ========================= */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  /* =========================
     TOTALS
  ========================= */
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
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
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}