"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/stringUtils";
import { useRouter } from "next/navigation";
import { getAllDiscounts } from "@/application/usecases/discountManagement/getDiscount";
import { errorMessage } from "@/components/ui/custom/Toast";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const {toast} = useToast();

  // Billing Information State
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "US",
  });

  // Payment Method and Discounts State
  const [paymentMethod, setPaymentMethod] = useState<string>("creditCard"); // Default payment method
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0); // Store discount amount

  // Total Amount States (Received via query)
  const [total, setTotal] = useState<number>(0);
  const [finalTotal, setFinalTotal] = useState<number>(0); // Updated total after discount

  // Load total from the query string
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const totalFromQuery = urlParams.get("total");
    if (totalFromQuery) {
      const parsedTotal = parseFloat(totalFromQuery);
      setTotal(parsedTotal); // Set total from query
      setFinalTotal(parsedTotal); // Initial final total is the same as the original total
    }
  }, []);

  useEffect(() => {
    setFinalTotal(total - discountAmount);
  }, [discountAmount, total]);

  // Handle changes in billing information
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Apply Discount Logic (API call to validate and apply discount)
  const applyDiscount = async () => {
    if (!couponCode) {
      alert("Please enter a coupon code.");
      return;
    }

    if (discountApplied) {
      alert("Discount has already been applied.");
      return;
    }

    try {
      const discounts = await getAllDiscounts();

      // Check if the entered coupon code matches any discount code
      const discount = discounts.find(d => d.type === couponCode);
      if (discount) {
        // Apply the discount
        setDiscountAmount(discount.discountAmount);
        setDiscountApplied(true);
        alert("Discount applied successfully!");
      } else {
        alert("Invalid coupon code.");
      }

    } catch (error) {
      console.error("Error applying discount:", error);
      errorMessage(toast, "Failed to apply discount. Please try again.");
    }
  };

  // Create order and order details
  const createOrder = async () => {
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerId: 1, // Assuming buyer ID is known (should be from authenticated user)
          sellerId: 1, // Assuming seller ID is hardcoded (replace with actual seller ID)
          billingInfo,
          paymentMethod, // Include selected payment method
          discountApplied,
          discountAmount,
          finalTotal,
        }),
      });

      const data = await response.json();

      // If the order creation is successful, redirect to the order confirmation page
      if (data.success) {
        alert("Order placed successfully!");
        router.push("/order-confirmation");
      } else {
        alert("There was an error processing your order.");
      }

    } catch (error) {
      console.error("Error creating order:", error);
      errorMessage(toast, "Failed to create order. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate billing information
    if (!billingInfo.name || !billingInfo.address || !billingInfo.city || !billingInfo.zip) {
      alert("Please fill out all required fields.");
      return;
    }

    // Create order
    await createOrder();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          {/* Billing Information */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Billing Information</h2>
          <div className="space-y-4">
            <Input name="name" placeholder="Full Name" value={billingInfo.name} onChange={handleChange} required />
            <Input name="address" placeholder="Address" value={billingInfo.address} onChange={handleChange} required />
            <Input name="city" placeholder="City" value={billingInfo.city} onChange={handleChange} required />
            <Input name="zip" placeholder="ZIP Code" value={billingInfo.zip} onChange={handleChange} required />
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={paymentMethod === "creditCard"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Credit Card
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                PayPal
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  checked={paymentMethod === "cashOnDelivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          {/* Coupon Code */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Discount Coupon</h2>
            <Input
              name="couponCode"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button type="button" onClick={applyDiscount} className="mt-2">Apply Discount</Button>
          </div>

          {/* Total Amount */}
          <div className="border-t pt-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-900">Amount to Pay</h2>
            <div className="flex justify-between">
              <span>Total (including tax)</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-red-600">
                <span>Discount Applied</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className={`flex justify-between font-bold ${discountApplied ? 'text-green-600' : ''}`}>
              <span>Final Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full py-3 mt-4" variant="outline">
            Place Order
          </Button>
        </form>
      </div>
    </div>
  );
}