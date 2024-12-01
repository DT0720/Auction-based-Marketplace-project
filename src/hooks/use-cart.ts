import { CartContext } from "@/application/context/CartContext";
import { useContext } from "react";

/**
 * Custom hook to access the cart context.
 * Ensures that the hook is used within a `CartProvider`.
 * 
 * @throws Will throw an error if the hook is used outside of a `CartProvider`.
 * @returns The current cart context value.
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
