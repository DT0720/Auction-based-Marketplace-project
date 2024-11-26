"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react"; // Icon for removing items
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/stringUtils";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import { useCart } from "@/hooks/use-cart";

export default function ShoppingCartPage() {

  const { updateCart, removeFromCart, cartItems } = useCart();

  const [userCartItems, setUserCartItems] = useState(cartItems);
  const taxRate = 0.1; // 10% tax rate
  const router = useRouter(); // Hook for navigation

  // Function to calculate the subtotal
  const calculateSubtotal = () => {
    return userCartItems.reduce(
      (acc, item) => acc + item.pricePerUnit * item.quantity,
      0
    );
  };

  // Function to calculate the tax
  const calculateTax = (subtotal: number) => {
    return subtotal * taxRate;
  };

  // Function to calculate the total (Subtotal + Tax)
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setUserCartItems((prevItems) =>
      prevItems.map((item) => {
          const newItem = item.id === id ? { ...item, quantity: newQuantity } : item
          return newItem;
        }
      )
    );
    updateCart(id, newQuantity);
  };

  const handleRemoveItem = (id: number) => {
    setUserCartItems((prevItems) => prevItems.filter((item) => item.id !== id ));
    removeFromCart(id);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal();

  const handleProceedToCheckout = () => {
    // Navigate to the checkout page
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Table for Cart Items */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Remove</th>
                </tr>
              </thead>
              <tbody>
                {userCartItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.photo ? item.photo : ImageStorageService.productPlaceholderImage}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <span className="font-semibold">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{formatCurrency(item.pricePerUnit)}</td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value))
                        }
                        className="w-16 p-2 text-center rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {formatCurrency((item.pricePerUnit * item.quantity))}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 p-2"
                        variant="ghost"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Totals */}
          <div className="mt-8">
            <div className="flex justify-between items-center text-lg font-semibold">
              <p>Subtotal</p>
              <p>{formatCurrency(subtotal)}</p>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold mt-2">
              <p>Tax (10%)</p>
              <p>{formatCurrency(tax)}</p>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold mt-2">
              <p>Total</p>
              <p>{formatCurrency(total)}</p>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleProceedToCheckout}
            className="w-full py-3 mt-8"
            variant= "outline"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
