import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "eco_cart_v2";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // item: { variantId, productId, sellerId, sellerName, title, imageUrl, price, size, color, sku, maxStock }
  const addItem = (item, qty = 1) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.variantId === item.variantId);
      if (existingIdx >= 0) {
        const next = [...prev];
        const newQty = Math.min(next[existingIdx].qty + qty, item.maxStock ?? 99);
        next[existingIdx] = { ...next[existingIdx], qty: newQty };
        return next;
      }
      return [...prev, { ...item, qty: Math.min(qty, item.maxStock ?? 99) }];
    });
  };

  const updateQty = (variantId, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.variantId !== variantId)
        : prev.map((i) => (i.variantId === variantId ? { ...i, qty: Math.min(qty, i.maxStock ?? 99) } : i))
    );
  };

  const removeItem = (variantId) => setItems((prev) => prev.filter((i) => i.variantId !== variantId));

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
