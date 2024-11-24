"use client";

import React, { useState, useEffect } from "react";
import CartItem from "@/components/ui/custom/CartItem";
import CartSummary from "@/components/ui/custom/CartSummary";

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState([]);
  const taxRate = 0.1;

  useEffect(() => {
    const items = [
      { id: "1", name: "Product 1", image: "/images/product1.jpg", price: 20, quantity: 2 },
      { id: "2", name: "Product 2", image: "/images/product2.jpg", price: 15, quantity: 1 },
    ];
    setCartItems(items);
  }, []);

  const handleRemoveItem = (id) => setCartItems((items) => items.filter((item) => item.id !== id));
  const handleUpdateQuantity = (id, quantity) =>
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  const handleBuyNow = (id) => alert(`Buy It Now for item ${id}!`);
  const handleCheckout = () => alert("Proceeding to Checkout!");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
        <CartSummary subtotal={subtotal} taxRate={taxRate} onCheckout={handleCheckout} />
      </div>
    </div>
  );
};

export default ShoppingCartPage;
