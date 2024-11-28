"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react"; // Icon for removing items
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/stringUtils";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import { useCart } from "@/hooks/use-cart"; // Importing CartContext

export default function ShoppingCartPage() {
    const { cartItems, updateCart, removeFromCart } = useCart(); // Cart context hooks
    const [userCartItems, setUserCartItems] = useState(cartItems);
    const taxRate = 0.1; // 10% tax rate
    const router = useRouter();

    // Sync state with the cart context
    useEffect(() => {
        setUserCartItems(cartItems);
    }, [cartItems]);

    // Calculate subtotal
    const calculateSubtotal = () => {
        return userCartItems.reduce(
            (acc, item) => acc + item.pricePerUnit * item.quantity,
            0
        );
    };

    // Calculate total (subtotal + tax)
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = subtotal * taxRate;
        return subtotal + tax;
    };

    // Proceed to checkout
    const handleProceedToCheckout = () => {
        const total = calculateTotal();
        router.push(`/checkout?total=${total}`); // Pass total as a query parameter
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
                <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    {/* Cart Items Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-200 text-left">
                                <tr>
                                    <th className="px-4 py-2">Product</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th className="px-4 py-2">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userCartItems.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="px-4 py-2">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={item.photo || ImageStorageService.productPlaceholderImage}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                                <span className="font-semibold">{item.productName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">{formatCurrency(item.pricePerUnit)}</td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    updateCart(item.id, parseInt(e.target.value))
                                                }
                                                className="w-16 text-center border-gray-300 shadow-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            {formatCurrency(item.pricePerUnit * item.quantity)}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-600"
                                                variant="ghost"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="mt-6 space-y-4 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Subtotal</p>
                            <p>{formatCurrency(calculateSubtotal())}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Tax (10%)</p>
                            <p>{formatCurrency(calculateSubtotal() * taxRate)}</p>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold">
                            <p>Total</p>
                            <p>{formatCurrency(calculateTotal())}</p>
                        </div>
                    </div>

                    {/* Proceed to Checkout Button */}
                    <Button
                        onClick={handleProceedToCheckout}
                        className="w-full py-3 mt-4"
                        variant="outline"
                    >
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
}
