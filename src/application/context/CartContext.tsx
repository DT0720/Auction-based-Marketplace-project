// src/contexts/CartContext.tsx

'use client';

import React, { createContext, useState, useEffect } from 'react';
import { LocalStorageService } from '@/infrastructure/services/LocalStorageService';
import { getProductById } from '../usecases/sellerDashboard/products/getProductById';
import useAuth from '@/hooks/use-auth';

interface CartContextProps {
  cartItems: any[];
  cartCount: number;
  addProductToCart: (product_id: number) => Promise<boolean>;
  removeFromCart: (itemId: number) => void;
  updateCart: (id: number, newQuantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const localStorageService = new LocalStorageService(user?.user_id ?? null);

  useEffect(() => {
    // If user is logged in, merge TEMP_CART with user-specific cart
    if (user?.user_id) {
      const tempCartService = new LocalStorageService(null);
      const userCartService = new LocalStorageService(user.user_id);
      const tempCart = tempCartService.getCache();
      const userCart = userCartService.getCache();

      // Merge temp cart into user cart and clear temp cart
      const mergedCart = [...userCart, ...tempCart];
      userCartService.clearCache(); // Clear the old user cart
      userCartService.appendToCache(mergedCart);
      tempCartService.clearCache(); // Clear the temp cart

      // Update cart state with merged cart
      setCartItems(mergedCart);
      setCartCount(mergedCart.length);
    } else {
      // If no user is logged in, load the TEMP_CART
      const items = localStorageService.getCache();
      setCartItems(items);
      setCartCount(items.length);
    }
  }, [user]);

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
