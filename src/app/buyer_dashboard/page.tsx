"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getAllProducts from "@/application/usecases/buyerDashboard/products/getAllProducts";
import { Product } from "@/domain/entities/Product";

// Main BuyerDashboard component
export default function BuyerDashboard() {

    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [categories] = useState<string[]>(['Top Picks', 'Super Deals', 'Trending', 'Ongoing Auctions']);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 

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

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex justify-center mt-16 p-4">
                <form onSubmit={handleSearch} className="flex w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Search here"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow border border-gray-300 rounded-l-md p-2"
                    />
                    <Button type="submit" className="bg-blue-500 text-white rounded-r-md p-2">
                        🔍
                    </Button>
                </form>
            </div>

            {/* Categories Section */}
            <div className="flex justify-center mt-4 space-x-4">
                {categories.map((category) => (
                    <Button key={category} onClick={() => handleCategoryClick(category)} className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                        {category}
                    </Button>
                ))}
            </div>

            {/* Products Display */}
            <main className="mt-8 p-4">
                {selectedCategory && (
                    <h2 className="text-xl font-bold mb-4">{selectedCategory}</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="border border-gray-300 rounded-lg p-4 text-center">
                            {/* <img src={URL.createObjectURL()} alt={product.productName} className="w-full h-auto mb-2" /> */}
                            <h3 className="font-semibold">{product.productName}</h3>
                            <p>Price: ${product.pricePerUnit.toFixed(2)}</p>
                            <Button onClick={() => console.log(`Adding ${product.productName} to cart`)} className="mt-2 bg-blue-500 text-white rounded p-1">
                                Add to Cart
                            </Button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}