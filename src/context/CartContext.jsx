"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("cart");

    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    if (cart !== null) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // ✅ Add
  const addToCart = (product) => {
    setCart([product]);
  };

  // ✅ Remove
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart: cart || [], addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
