import React from "react";
import { Card } from "../card"; // Reuse Card component
import { Button } from "../button"; // Reuse Button component

type CartItemProps = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onBuyNow: (id: string) => void;
};

const CartItem: React.FC<CartItemProps> = ({ id, name, image, price, quantity, onRemove, onUpdateQuantity, onBuyNow }) => {
  return (
    <Card className="flex items-center gap-4 p-4">
      <img src={image} alt={name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">Price: ${price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="outline" onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}>
            -
          </Button>
          <span>{quantity}</span>
          <Button variant="outline" onClick={() => onUpdateQuantity(id, quantity + 1)}>
            +
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="destructive" onClick={() => onRemove(id)}>
          Remove
        </Button>
        <Button variant="primary" onClick={() => onBuyNow(id)}>
          Buy It Now
        </Button>
      </div>
    </Card>
  );
};

export default CartItem;
