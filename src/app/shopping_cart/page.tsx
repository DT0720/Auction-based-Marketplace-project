"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import getAllProducts from "@/application/usecases/buyerDashboard/products/getAllProducts";
import { Product } from "@/domain/entities/Product";

// Main BuyerDashboard component
export default function BuyerDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await getAllProducts();
                setProducts(fetchedProducts);
            } catch (error: any) {
                console.error('Error fetching products:', error.message);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white">

            {/* Products Display */}
            <main className="mt-8 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="border border-gray-300 rounded-lg p-4 text-center">
                            {/* <img src={URL.createObjectURL()} alt={product.productName} className="w-full h-auto mb-2" /> */}
                            <h3 className="font-semibold">{product.productName}</h3>
                            <p>Price: ${product.pricePerUnit.toFixed(2)}</p>
                            <Button onClick={() => console.log(`Adding ${product.productName} to cart`)} className="mt-2 text-white rounded p-1">
                                Add to Cart
                            </Button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}