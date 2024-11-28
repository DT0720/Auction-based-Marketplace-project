"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/stringUtils";
import { PrismaClient } from "@prisma/client"; // Import Prisma client

// Initialize Prisma client
const prisma = new PrismaClient();

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
  const [discountAmount, setDiscountAmount] = useState<number>(0); // Store discount amount

  // Total Amount (received via query)
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

  // Handle changes in billing information
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Apply Discount Logic (fetch from DB)
  const applyDiscount = async () => {
    if (couponCode && !discountApplied) {
      try {
        // Fetch discount from the database using the coupon code
        const offer = await prisma.offers.findFirst({
          where: { type: couponCode }, // Assuming coupon code is stored in the 'type' field
        });

        if (offer) {
          // Convert discount from Decimal to number
          const discountValue = offer.discount_amount.toNumber();
          setDiscountAmount(discountValue);

          // Calculate new total after discount
          const newTotal = total - discountValue;
          setFinalTotal(newTotal); // Update the final total

          // Mark discount as applied
          setDiscountApplied(true);
          alert(`Discount Applied: ${formatCurrency(discountValue)} off!`);
        } else {
          alert("Invalid Coupon Code");
        }
      } catch (error) {
        console.error("Error applying discount:", error);
        alert("There was an error applying the discount.");
      }
    } else if (discountApplied) {
      alert("Discount has already been applied!");
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

    // Create order in Prisma with applied discount
    try {
      // Create the order in the database
      const order = await prisma.orders.create({
        data: {
          buyer_id: 1, // Assuming a hardcoded buyer ID (you should use the authenticated user's ID)
          seller_id: 1, // Assuming a hardcoded seller ID
          offer_id: discountApplied ? 1 : null, // Apply the discount offer if discount is applied
          status: "pending",
          order_details: {
            create: [
              {
                product_id: 1, // Assuming a hardcoded product ID
                quantity: 1, // Assuming quantity of 1 for the product
              },
            ],
          },
        },
      });

      // Redirect to confirmation page on success
      if (order) {
        router.push("/order-confirmation");
      } else {
        alert("Error during checkout.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an issue processing your order.");
    }
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
            <h2 className="text-xl font-semibold text-gray-900">Total Amount to Pay</h2>
            <div className="flex justify-between">
              <span>Total (including tax)</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-red-600">
                <span>Discount Applied</span>
                <span>{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
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