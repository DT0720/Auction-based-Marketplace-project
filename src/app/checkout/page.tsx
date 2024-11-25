"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function CheckoutPage() {
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "US",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("creditCard");
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);

  // Mock cart data
  const [cartData] = useState<any>({
    cartItems: [
      { id: 1, name: "Product 1", quantity: 2, price: 20 }, // 2 items, $20 each
      { id: 2, name: "Product 2", quantity: 1, price: 50 }, // 1 item, $50
    ],
  });

  // Calculate subtotal
  const subtotal = cartData.cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );
  
  // Apply discount if applicable
  const total = discountApplied ? subtotal * 0.9 : subtotal; // Apply discount if applicable

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  const applyDiscount = () => {
    if (couponCode === "DISCOUNT10") {
      setDiscountApplied(true);
      alert("Discount Applied: 10% off!");
    } else {
      alert("Invalid Coupon Code");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Checkout Info Submitted:", billingInfo, paymentMethod);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          {/* Billing Information Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Billing Information</h2>
          </div>
          
          {/* Billing Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={billingInfo.name}
                onChange={handleChange}
                className="mt-2 w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={billingInfo.address}
                onChange={handleChange}
                className="mt-2 w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* City, Zip, and Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="Enter your city"
                value={billingInfo.city}
                onChange={handleChange}
                className="mt-2 w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <Input
                type="text"
                id="zip"
                name="zip"
                placeholder="Enter your zip code"
                value={billingInfo.zip}
                onChange={handleChange}
                className="mt-2 w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <Input
                type="text"
                id="country"
                name="country"
                placeholder="Enter your country"
                value={billingInfo.country}
                onChange={handleChange}
                className="mt-2 w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {["creditCard", "bkash", "rocket", "nagad"].map((method) => (
                <Card
                  key={method}
                  className={`p-4 rounded-md border ${
                    paymentMethod === method ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onClick={() => handlePaymentChange(method)}
                >
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">{method}</h3>
                </Card>
              ))}
            </div>
          </div>

          {/* Discount Coupon */}
          <div>
            <label htmlFor="coupon" className="block text-sm font-medium text-gray-700">
              Discount Coupon
            </label>
            <div className="flex items-center space-x-4 mt-4">
              <Input
                type="text"
                id="coupon"
                name="coupon"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={handleCouponChange}
                className="w-3/4 p-3 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                onClick={applyDiscount}
                className="w-1/4 py-3 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 rounded-md"
              >
                Apply
              </Button>
            </div>
            {discountApplied && <p className="mt-2 text-green-600">Discount applied successfully!</p>}
          </div>

          {/* Total Amount to Pay */}
          <div className="border-t pt-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Total Amount to Pay</h2>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between font-semibold text-lg mb-4 text-green-600">
                  <span>Discount (10%)</span>
                  <span>-{formatCurrency(subtotal * 0.1)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl mb-4">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Proceed to Checkout Button */}
          <Button
            type="submit"
            className="w-full py-3 mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 rounded-md"
          >
            Proceed to Checkout
          </Button>
        </form>
      </div>
    </div>
  );
}
