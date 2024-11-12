// src/components/Form/PaymentForm.js
"use client"

import { useState } from "react";
import InputField from "../templates/InputField";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CreditCard, DollarSign } from "lucide-react";
import CustomInputField from "../templates/CustomInputField";

export default function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ paymentMethod, name, cardNumber, expiryMonth, expiryYear, cvv });
  };

  return (
    <Card className="max-w-lg mx-auto p-6 shadow-lg">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Payment Information</h2>
      </CardHeader>

      <CardContent>
        {/* Payment Method Selection */}
        <div className="flex justify-between space-x-4 mb-6">
          <Card
            className={`cursor-pointer p-16 flex items-center justify-center ${
              paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <CreditCard className="w-6 h-6 mr-2" />
            <span>Card</span>
          </Card>

          <Card
            className={`cursor-pointer p-16 flex items-center justify-center ${
              paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <DollarSign className="w-6 h-6 mr-2" />
            <span>PayPal</span>
          </Card>
        </div>

        {/* Name on Card/PayPal */}
        <InputField
          label="Name on Card/PayPal"
          placeholder="John Doe"
          value={name}
          onChange={setName}
          required
        />

        {/* Card Number */}
        <InputField
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          type="text"
          value={cardNumber}
          onChange={setCardNumber}
          maxLength={16}
          required
        />

        {/* Expiry Date and CVV on the Same Line */}
        <div className="flex space-x-4 items-end mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <div className="flex space-x-2">
              <Select onValueChange={setExpiryMonth}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12).keys()].map((m) => (
                    <SelectItem key={m + 1} value={String(m + 1).padStart(2, "0")}>
                      {String(m + 1).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={setExpiryYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="YY" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10).keys()].map((y) => {
                    const year = new Date().getFullYear() + y;
                    return (
                      <SelectItem key={year} value={String(year).slice(-2)}>
                        {String(year).slice(-2)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1">
            <CustomInputField
              label="CVV"
              padding="pl-3"
              placeholder="123"
              type="text"
              value={cvv}
              onChange={setCvv}
              maxLength={3}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-6">Pay Now</Button>
      </CardContent>
    </Card>
  );
}
