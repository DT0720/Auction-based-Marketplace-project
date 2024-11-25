import * as React from "react";
import { Button } from "@/components/ui/button"; // Corrected import statement
import { useState } from "react";

// Define the type for CartItem props
interface CartItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  description,
  price,
  quantity,
  image,
  onRemove,
  onUpdateQuantity,
}) => {
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    setItemQuantity(newQuantity);
    onUpdateQuantity(id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(id);
  };

  return (
    <div className="cart-item flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-4">
        <img src={image} alt={name} className="h-16 w-16 object-cover" />
        <div>
          <h3 className="font-medium">{name}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <input
          type="number"
          value={itemQuantity}
          onChange={handleQuantityChange}
          min="1"
          className="border rounded p-1 w-16 text-center"
        />
        <p className="text-lg font-semibold">${(price * itemQuantity).toFixed(2)}</p>
        <Button variant="destructive" onClick={handleRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
