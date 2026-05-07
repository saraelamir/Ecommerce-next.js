'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '@/lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0 });
      setCartCount(0);
      return;
    }
    try {
      const data = await cartAPI.get();
      // Handle different response shapes: { items } or { cart: { items } } or array
      const items = data?.items || data?.cart?.items || (Array.isArray(data) ? data : []);
      const total = data?.total || data?.cart?.total || 0;
      setCart({ items, total });
      const count = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    } catch {
      setCart({ items: [], total: 0 });
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    await cartAPI.add(productId, quantity);
    await fetchCart();
  };

  const updateItem = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    await cartAPI.update(productId, quantity);
    await fetchCart();
  };

  const removeItem = async (productId) => {
    await cartAPI.remove(productId);
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateItem, removeItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
