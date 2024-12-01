import React from "react";
import { Card } from "../card"; // Reuse Card component
import { Button } from "../button"; // Reuse Button component

/**
 * Props for the CartSummary component.
 */

type CartSummaryProps = {
    /**
     * The subtotal amount for the items in the cart.
     */

    subtotal: number;

    /**
     * The tax rate to be applied to the subtotal.
     */

    taxRate: number;

    /**
     * Callback function triggered when the user proceeds to checkout.
     */

    onCheckout: () => void;
};

/**
 * CartSummary Component.
 * Displays the summary of the cart, including subtotal, tax, and total amounts.
 * Also provides a button to proceed to checkout.
 *
 * @param {CartSummaryProps} props - The props for the CartSummary component.
 * @returns {JSX.Element} - The rendered CartSummary component.
 */

const CartSummary: React.FC<CartSummaryProps> = ({
    subtotal,
    taxRate,
    onCheckout,
}) => {
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
