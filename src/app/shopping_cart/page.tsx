// pages/shopping_cart/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import CartItem from "@/components/ui/custom/CartItem";
import CartSummary from "@/components/ui/custom/CartSummary";

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Mock fetch function; replace with actual API call
    const fetchCartItems = async () => {
      const items = [
        { id: "1", name: "Product 1", image: "/images/product1.jpg", price: 20, quantity: 2 },
        { id: "2", name: "Product 2", image: "/images/product2.jpg", price: 15, quantity: 1 },
      ];
      setCartItems(items);
      calculateTotal(items);
    };

    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(total);
  };

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleUpdateQuantity = (id, quantity) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout!");
  };

  return (
    <div className="shopping-cart p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              {...item}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </div>
        <CartSummary total={total} onCheckout={handleCheckout} />
      </div>
    </div>
  );
};

export default ShoppingCartPage;
