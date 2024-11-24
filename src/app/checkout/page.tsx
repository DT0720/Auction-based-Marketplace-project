"use client";

import React, { useState } from "react";

const CheckoutPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", address: "", payment: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Checkout successful!");
  };

  return (
    <div className="checkout-page p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name:
          <input type="text" name="name" className="w-full border p-2" onChange={handleChange} />
        </label>
        <label className="block mb-2">
          Address:
          <textarea name="address" className="w-full border p-2" onChange={handleChange} />
        </label>
        <label className="block mb-2">
          Payment Info:
          <input type="text" name="payment" className="w-full border p-2" onChange={handleChange} />
        </label>
        <button className="w-full mt-4 bg-blue-500 text-white p-2" type="submit">
          Confirm Purchase
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
