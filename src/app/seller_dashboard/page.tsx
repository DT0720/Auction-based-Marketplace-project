"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import getAllProducts from "@/application/usecases/buyerDashboard/products/getAllProducts";
import { Product } from "@/domain/entities/Product";
import { Card } from "@/components/ui/card";
import { useLoader } from "@/hooks/use-loader";
import { useRouter } from "next/navigation";

// Main sellerDashboard component
export default function sellerDashboard()
 {
    const [products, setProducts] = useState<Product[]>([]);
    const { showLoader, hideLoader } = useLoader();
    const router = useRouter();
    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => 
            {
            try {
                showLoader();
                const fetchedProducts = await getAllProducts();
                setProducts(fetchedProducts);
            } catch (error: any) {
                console.error('Error fetching products:', error.message);
            }finally{
                hideLoader();
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Products Display */}
            <main className="mt-8 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                        <Card key={product.id} 
                        className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:cursor-pointer"
                        onClick={() => router.push(`/product/${product.id}`)}
                        >
                            <div className="mb-4">
                              <img src={product.photo ?? ""} alt={product.productName} className="w-full h-auto mb-2" />
                            </div>
                            <div className="mb-4">
                              <h3 className="font-semibold text-lg">{product.productName}</h3>
                              <p className="text-sm text-gray-500">Category: {product.category}</p>
                              <p className="font-bold mt-2">Price: ${product.pricePerUnit.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between mt-auto">
                              <Button onClick={() => console.log(`Putting ${product.productName} up for auction`)} className="w-1/2  rounded p-2 mr-2">
                                Put Up for Auction
                              </Button>
                              <Button onClick={() => console.log(`Putting ${product.productName} up for sale`)} className="w-1/2  rounded p-2" variant= "outline">
                                Put Up for Sale
                              </Button>
                            </div>
                        </Card>
                        ))
                    ) : (
                        <p>No products available</p> // Add a fallback message if no products are available
                    )}
                </div>
            </main>
        </div>
    );
}