"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import getAllProducts from "@/application/usecases/buyerDashboard/products/getAllProducts";
import { Product } from "@/domain/entities/Product";
import { Card } from "@/components/ui/card";
import { useLoader } from "@/hooks/use-loader";
import { useRouter } from "next/navigation";

// Main BuyerDashboard component
export default function BuyerDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [ongoingAuctions, setOngoingAuctions] = useState<Product[]>([]); // State for ongoing auctions
    const { showLoader, hideLoader } = useLoader();
    const router = useRouter();

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                showLoader();
                const fetchedProducts = await getAllProducts();
                setProducts(fetchedProducts);

                // Create dummy ongoing auction products using the Product constructor parameters
                const dummyOngoingAuctions: Product[] = [
                    new Product(201, "Antique Vase", 5, 150.00, "Antiques", null),
                    new Product(202, "Vintage Guitar", 2, 300.00, "Musical Instruments", null),
                    new Product(203, "Rare Comic Book", 10, 75.00, "Collectibles", null),
                    new Product(204, "Collectible Stamp Set", 8, 50.00, "Philately", null),
                ];

                setOngoingAuctions(dummyOngoingAuctions); // Set the dummy auctions
            } catch (error: any) {
                console.error('Error fetching products:', error.message);
            } finally {
                hideLoader();
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Products Display */}
            <main className="mt-8 p-4">
                <h2 className="text-xl font-bold mb-4">Available Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Card 
                                key={product.id} 
                                className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg"
                                onClick={() => router.push(`/product/${product.id}`)}
                            >
                                <div className="mb-4">
                                    <img src={product.photo ?? ""} alt={product.productName} className="w-full h-auto mb-2" />
                                </div>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg">{product.productName}</h3>
                                    <p className="text-sm text-gray-500">Category: {product.category}</p>
                                    {/* <p className="text-sm text-gray-500">Rating: {product.rating ? product.rating : 'N/A'} / 5</p>
                                    <p className="text-sm text-gray-500">Reviews: {product.reviewsCount || 0}</p> */}
                                    <p className="font-bold mt-2">Price: ${product.pricePerUnit.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-end mt-auto">
                                    <Button onClick={() => console.log(`Adding ${product.productName} to cart`)} className="w-full rounded p-2" variant="outline">
                                        Add to Cart
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p>No products available</p> // Fallback message if no products are available
                    )}
                </div>

                {/* Ongoing Auctions Section */}
                <h2 className="text-xl font-bold mt-8 mb-4">Ongoing Auctions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ongoingAuctions.length > 0 ? (
                        ongoingAuctions.map((auction) => (
                            <Card 
                                key={auction.id} 
                                className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg"
                                onClick={() => router.push(`/auction/${auction.id}`)} // Assuming you have a separate auction page
                            >
                                <div className="mb-4">
                                    <img src={auction.photo ?? ""} alt={auction.productName} className="w-full h-auto mb-2" />
                                </div>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg">{auction.productName}</h3>
                                    <p className="font-bold mt-2">Starting Bid: ${auction.pricePerUnit.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-end mt-auto">
                                    <Button onClick={() => console.log(`Bidding on ${auction.productName}`)} className="w-full rounded p-2" variant="outline">
                                        Place Bid
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p>No ongoing auctions available</p> // Fallback message for no ongoing auctions
                    )}
                </div>
            </main>
        </div>
    );
}