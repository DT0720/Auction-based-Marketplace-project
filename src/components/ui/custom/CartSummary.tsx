import React from "react";
import { Card } from "../card"; // Reuse Card component
import { Button } from "../button"; // Reuse Button component

type CartSummaryProps = {
  subtotal: number;
  taxRate: number;
  onCheckout: () => void;
};

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, taxRate, onCheckout }) => {
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Cart Summary</h2>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
      <Button className="mt-4 w-full" onClick={onCheckout}>
        Proceed to Checkout
      </Button>
    </Card>
  );
};

export default CartSummary;
