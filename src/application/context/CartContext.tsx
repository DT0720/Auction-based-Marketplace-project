// src/contexts/CartContext.tsx

'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { LocalStorageService } from '@/infrastructure/services/LocalStorageService';
import { getProductById } from '../usecases/sellerDashboard/products/getProductById';
import useAuth from '@/hooks/use-auth';
import { useLoader } from '@/hooks/use-loader';

interface CartContextProps {
  cartItems: any[];
  cartCount: number;
  addProductToCart: (userId: number, product_id: number) => Promise<boolean>;
  removeFromCart: (itemId: number) => void;
  updateCart: (id: number, newQuantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const localStorageService = new LocalStorageService(user?.user_id ?? 0);

  useEffect(() => {
    const items = localStorageService.getCache();
    setCartItems(items);
    setCartCount(items.length);
  }, []);

  const addProductToCart = async (product_id: number): Promise<boolean> => {
    try {
      const product = await getProductById(product_id);

      if (!product) {
        throw new Error('Product not found');
      }

      const cache = localStorageService.getCache();
      const existingProduct = cache.find(item => item.id === product_id);

      if (existingProduct) {
        console.log('Updating product');
        localStorageService.updateCache(product_id, (item) => ({
          ...item,
          quantity: item.quantity + 1,
        }));
      } else {
        console.log('Adding product');
        localStorageService.addToCache({ ...product, quantity: 1 });
      }

      // Update cart state
      const updatedCache = localStorageService.getCache();
      setCartItems(updatedCache);
      setCartCount(updatedCache.length);

      return true;
    } catch (error: any) {
      console.error('Error adding product to cart:', error.message);
      return false;
    }
  };

  const updateCart = (id: number, newQuantity: number) => {
      const existingItem = localStorageService.getCache().find(item => item.id === id);
      if (existingItem) {
        localStorageService.updateCache(id, item => ({ ...item, quantity: newQuantity }));
      }
      
      // Update cartItems and cartCount from localStorage
      const items = localStorageService.getCache();
      setCartItems(items);
      setCartCount(items.length);
  };

  const removeFromCart = (itemId: number) => {
    localStorageService.removeFromCache(itemId);
    const updatedItems = localStorageService.getCache();
    setCartItems(updatedItems);
    setCartCount(updatedItems.length);
  };

  const clearCart = () => {
    localStorageService.clearCache();
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addProductToCart, removeFromCart, updateCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
