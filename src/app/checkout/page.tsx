"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/stringUtils";
import { useRouter } from "next/navigation";
import { get } from "http";
import { getAllDiscounts } from "@/application/usecases/discountManagement/getDiscount";
import { errorMessage } from "@/components/ui/custom/Toast";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const router = useRouter();

  // Billing Information
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "US",
  });

  // Payment Method and Discounts
  const [paymentMethod, setPaymentMethod] = useState<string>("creditCard");
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const {toast} = useToast();

  // Total Amount
  const [total, setTotal] = useState<number>(100); // Default total
  const [finalTotal, setFinalTotal] = useState<number>(total); // Total after discount

  useEffect(() => {
    setFinalTotal(total - discountAmount);
  }, [discountAmount]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Apply discount
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
      const response = await getAllDiscounts();

      const data = response;

    } catch (error) {
      console.error("Error applying discount:", error);
      errorMessage(toast, "Failed to apply discount. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!billingInfo.name || !billingInfo.address || !billingInfo.city || !billingInfo.zip) {
      alert("Please fill out all required fields.");
      return;
    }

    alert(`Order placed successfully! Total: ${formatCurrency(finalTotal)}`);
    router.push("/order-confirmation"); // Redirect to confirmation page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6">
          <h2 className="text-xl font-semibold">Billing Information</h2>
          <Input name="name" placeholder="Full Name" value={billingInfo.name} onChange={handleInputChange} required />
          <Input name="address" placeholder="Address" value={billingInfo.address} onChange={handleInputChange} required />
          <Input name="city" placeholder="City" value={billingInfo.city} onChange={handleInputChange} required />
          <Input name="zip" placeholder="ZIP Code" value={billingInfo.zip} onChange={handleInputChange} required />

          <h2 className="text-xl font-semibold">Coupon Code</h2>
          <Input name="couponCode" placeholder="Enter Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
          <Button type="button" onClick={applyDiscount} className="mt-4">
            Apply Discount
          </Button>

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Total</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Final Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 mt-6" variant="outline">
            Place Order
          </Button>
        </form>
      </div>
    </div>
  );
}
