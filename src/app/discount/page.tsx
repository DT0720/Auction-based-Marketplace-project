"use client"
import React, { useState } from "react";

// PromotionManager Class
class PromotionManager
 {
  private notifications: string[] = [];

  constructor
  (
    private minimumPurchaseForDiscount: number,
    private discountPercentage: number
  ) {}

  // Method to calculate total price after applying discounts
  public calculateTotalPrice(
    products: { price: number; quantity: number }[]
  ): 
    number {
    let totalBill = 0;

    // Calculate total bill
    products.forEach((product) => 
    {
      totalBill += product.price * product.quantity;
    });

    // Apply discount if minimum purchase amount is exceeded
    if (totalBill >= this.minimumPurchaseForDiscount)
     {
        const discount = (totalBill * this.discountPercentage) / 100;
        totalBill -= discount;
        this.sendNotification(`A discount of ${this.discountPercentage}% has been applied to your total bill.`);
      }

    else 
    {
       this.sendNotification(`You are not eligible for discount.`);
    }

    return totalBill;
  }

  // Method to apply a coupon code
  public applyCoupon
  (
    couponCode: string,
    products: { price: number; quantity: number }[]
  ): 
    number 
    {
      let total = this.calculateTotalPrice(products);

    // Example coupon logic
    if (couponCode === "DURJOY")
       {
            total -= 20; // Flat $20 discount
            this.sendNotification("Coupon code DURJOY applied. $20 discount added.");
       } 
    else if (couponCode === "FREESHIP")
        {
            this.sendNotification("Coupon code FREESHIP applied. Free shipping added.");
        } 
    else 
        {
            this.sendNotification("Invalid coupon code.");
        }

    return total;
  }

  private sendNotification(message: string)
     {
         this.notifications.push(message);
     }

  public getNotifications(): string[]
     {
       return this.notifications;
     }
}

// React Component
const DiscountCalculator: React.FC = () => {
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleCalculate = () => {
    const manager = new PromotionManager(100, 10); // $100 minimum for 10% discount
    const products = [
      { price: 35, quantity: 2 }, // Example products
      { price: 30, quantity: 1 },
    ];
    const total = couponCode
      ? manager.applyCoupon(couponCode, products)
      : manager.calculateTotalPrice(products);
    setTotalPrice(total);
    setNotifications(manager.getNotifications());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Discount & Coupon Calculator</h1>
      <div>
        <label>
          Enter Coupon Code:{" "}
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="e.g., DURJOY"
          />
        </label>
      </div>
      <button onClick={handleCalculate} style={{ marginTop: "10px" }}>
        Calculate Discounted Price
      </button>
      {totalPrice !== null && <p>Total Price: ${totalPrice.toFixed(2)}</p>}
      {notifications.length > 0 && (
        <div>
          <h3>Notifications:</h3>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiscountCalculator;