"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLoader } from "@/hooks/use-loader";
import { useRouter } from "next/navigation";
import { CartItem } from "@/domain/entities/CartItem"; // Assuming a CartItem entity exists

// Mock function to simulate fetching cart data
const fetchCartItems = async (): Promise<CartItem[]> => {
    // Replace with an actual API call
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve([
                {
                    id: "1",
                    productName: "Product 1",
                    photo: "/images/product1.jpg",
                    pricePerUnit: 20.0,
                    quantity: 2,
                },
                {
                    id: "2",
                    productName: "Product 2",
                    photo: "/images/product2.jpg",
                    pricePerUnit: 15.0,
                    quantity: 1,
                },
            ]);
        }, 1000)
    );
};

// Main ShoppingCart component
export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { showLoader, hideLoader } = useLoader();
    const router = useRouter();

    // Fetch cart items on component mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                showLoader();
                const items = await fetchCartItems();
                setCartItems(items);
            } catch (error: any) {
                console.error("Error fetching cart items:", error.message);
            } finally {
                hideLoader();
            }
        };
        fetchCart();
    }, []);

    // Update quantity of a cart item
    const updateQuantity = (itemId: string, newQuantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Remove item from cart
    const removeItem = (itemId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.pricePerUnit * item.quantity,
            0
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
                {cartItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {cartItems.map((item) => (
                                <Card
                                    key={item.id}
                                    className="border border-gray-300 rounded-lg p-4 flex justify-between items-center"
                                >
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.photo}
                                            alt={item.productName}
                                            className="w-24 h-24 object-cover"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-lg">{item.productName}</h3>
                                            <p className="text-sm text-gray-500">
                                                Price: ${item.pricePerUnit.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Quantity:{" "}
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min={1}
                                                    className="border rounded w-16 text-center"
                                                    onChange={(e) =>
                                                        updateQuantity(
                                                            item.id,
                                                            parseInt(e.target.value)
                                                        )
                                                    }
                                                />
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => removeItem(item.id)}
                                        className="rounded p-2"
                                        variant="outline"
                                    >
                                        Remove
                                    </Button>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Total: ${calculateTotal().toFixed(2)}
                            </h2>
                            <Button
                                onClick={() => router.push("/checkout")}
                                className="rounded p-2"
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center mt-20">
                        Your cart is empty.{" "}
                        <a
                            href="/products"
                            className="text-blue-500 hover:underline"
                        >
                            Continue Shopping
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}
