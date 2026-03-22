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
     SAVE CART TO LOCALSTORAGE
  ========================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* =========================
     🔥 SYNC CART WITH BACKEND (FIXED)
  ========================= */
  useEffect(() => {
    const syncCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const products = await res.json();

        const updatedCart = cart
          .map(item => {
            const latest = products.find(p => p._id === item.id);

            if (!latest) return null; // 🗑 removed product

            return {
              ...item,
              price: latest.price,        // 🔥 update price
              title: latest.title,
              image: latest.image,
            };
          })
          .filter(Boolean);

        // 🔥 Only update if something actually changed
        const isChanged =
          JSON.stringify(updatedCart) !== JSON.stringify(cart);

        if (isChanged) {
          setCart(updatedCart);
        }

      } catch (err) {
        console.error("Cart sync error:", err);
      }
    };

    if (cart.length > 0) {
      syncCart();
    }
  }, []); // ✅ ONLY ON LOAD (NO LOOP)

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = (product) => {
    if (!product?.id) return;

    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
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
     TOTALS
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