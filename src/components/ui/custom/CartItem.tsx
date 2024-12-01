import * as React from "react";
import { Button } from "@/components/ui/button"; // Corrected import statement
import { useState } from "react";

/**
 * Props for the CartItem component.
 */

interface CartItemProps {
    /**
     * The unique identifier for the cart item.
     */
    id: string;
    /**
     * The name of the cart item.
     */
    name: string;
    /**
     * A brief description of the cart item.
     */
    description: string;
    /**
     * The price of a single unit of the cart item.
     */
    price: number;
    /**
     * The initial quantity of the cart item.
     */
    quantity: number;
    /**
     * The URL of the cart item's image.
     */
    image: string;
    /**
     * Callback function triggered when the cart item is removed.
     * @param id - The unique identifier of the cart item to be removed.
     */
    onRemove: (id: string) => void;
    /**
     * Callback function triggered when the quantity of the cart item is updated.
     * @param id - The unique identifier of the cart item.
     * @param quantity - The new quantity of the cart item.
     */
    onUpdateQuantity: (id: string, quantity: number) => void;
}

/**
 * A component that represents a single item in the shopping cart.
 *
 * @param {CartItemProps} props - The props for the CartItem component.
 * @returns {JSX.Element} - The rendered CartItem component.
 */

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

    /**
     * Handles changes to the item quantity input.
     * Updates the state and triggers the `onUpdateQuantity` callback.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        setItemQuantity(newQuantity);
        onUpdateQuantity(id, newQuantity);
    };

    /**
     * Handles the removal of the cart item.
     * Triggers the `onRemove` callback with the item's ID.
     */

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
                <p className="text-lg font-semibold">
                    ${(price * itemQuantity).toFixed(2)}
                </p>
                <Button variant="destructive" onClick={handleRemove}>
                    Remove
                </Button>
            </div>
        </div>
    );
};

export default CartItem;
