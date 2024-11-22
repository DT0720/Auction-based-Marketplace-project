"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the Product type
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

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
                const response = await fetch('/api/products'); // Adjust endpoint as needed
                const fetchedProducts = await response.json();
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
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
            {/* Fixed Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 bg-black text-white flex items-center justify-between p-4 z-10">
                <div className="flex items-center">
                    <Button title="Settings" onClick={() => console.log('Navigating to settings')}>
                        ⚙️
                    </Button>
                    <Button title="Logout" onClick={() => console.log('Logging out')} className="ml-4">
                        Logout
                    </Button>
                    <Button title="Ongoing Orders" onClick={() => console.log('Viewing ongoing orders')} className="ml-4">
                        Ongoing Orders
                    </Button>
                </div>
                <div className="flex items-center">
                    <Button title="Profile" onClick={() => console.log('Navigating to profile')}>
                        👤
                    </Button>
                    <Button title="View Cart" onClick={() => console.log('Viewing cart')} className="ml-4">
                        🛒
                    </Button>
                    <span className="ml-4">Credit: $XX.XX</span>
                </div>
            </nav>

            {/* Search Bar */}
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
                            <img src={product.image} alt={product.name} className="w-full h-auto mb-2" />
                            <h3 className="font-semibold">{product.name}</h3>
                            <p>Price: ${product.price.toFixed(2)}</p>
                            <Button onClick={() => console.log(`Adding ${product.name} to cart`)} className="mt-2 bg-blue-500 text-white rounded p-1">
                                Add to Cart
                            </Button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}