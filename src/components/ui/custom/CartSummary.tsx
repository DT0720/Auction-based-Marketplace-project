// components/ui/custom/CartSummary.tsx
import React from "react";
import { Card } from "../card"; // Reuse the Card component
import { Button } from "../button"; // Reuse the Button component

type CartSummaryProps = {
  total: number;
  onCheckout: () => void;
};

const CartSummary: React.FC<CartSummaryProps> = ({ total, onCheckout }) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Cart Summary</h2>
      <p className="mt-2 text-sm text-gray-500">Total: ${total.toFixed(2)}</p>
      <Button className="mt-4 w-full" onClick={onCheckout}>
        Proceed to Checkout
      </Button>
    </Card>
  );
};

export default CartSummary;
