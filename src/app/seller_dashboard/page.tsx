"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/domain/entities/Product";
import { Card } from "@/components/ui/card";
import { useLoader } from "@/hooks/use-loader";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import NoProductsAvailable from "@/components/ui/custom/NoProductsAvailable";
import { ROUTES } from "@/application/routing/routes";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import useAuth from "@/hooks/use-auth";
import { getProductBySellerId } from "@/application/usecases/sellerDashboard/products/getProductById";
import { formatCurrency } from "@/lib/stringUtils";
import { useFilters } from "@/hooks/use-filter";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";

/**
 * Seller Dashboard Component
 *
 * Displays a list of products for a seller, with filtering and navigation options.
 *
 * @component
 */

export default function sellerDashboard()
 {
    /**
     * State for storing all products fetched from the server.
     * @type {Array<Product>}
     */

    const [products, setProducts] = useState<Product[]>([]);

    /**
     * State for storing filtered products based on search query and category.
     * @type {Array<Product>}
     */

    const { showLoader, hideLoader } = useLoader();

    /**
     * Custom hook for getting authentication-related information.
     * @typedef {Object} AuthHook
     * @property {string} buyer_seller_id - Unique ID for the seller or buyer.
     */

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    /**
     * Custom hook for showing and hiding a loader.
     * @typedef {Object} LoaderHook
     * @property {Function} showLoader - Function to display the loader.
     * @property {Function} hideLoader - Function to hide the loader.
     */

    const { searchQuery, category } = useFilters();

    /**
     * Router instance for navigation.
     * @typedef {Object} Router
     * @property {Function} push - Function to navigate to a specific route.
     */

    const { buyer_seller_id } = useAuth();

     /**
     * Custom hook for getting filter information.
     * @typedef {Object} FiltersHook
     * @property {string} searchQuery - The current search query.
     * @property {string} category - The selected category filter.
     */

    const router = useRouter();

    /**
     * Fetches products from the server based on the seller ID.
     * Updates both the 'products' and 'filteredProducts' state variables.
     * Runs on component mount.
     */

    
    useEffect(() => {
        const fetchProducts = async () => 
            {
            try {
                showLoader();
                const fetchedProducts = await getProductBySellerId(buyer_seller_id);
                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts);
            } catch (error: any) {
                console.error('Error fetching products:', error.message);
            }finally{
                hideLoader();
            }
        };
        fetchProducts();
    }, []);

    /**
     * Filters products based on the search query and selected category.
     * Runs whenever 'searchQuery', 'category', or 'products' changes.
     */

    useEffect(() => {
        const filtered = products.filter((product) => {
            const lowercasedQuery = searchQuery.toLowerCase();
          
            // If the selected category is ALL, return all products that match the search query (or all if no query is provided)
            console.log("Outside Category is: " + category + " Enum is: " + ProductTypeEnum.ALL + " Product is: " + product.productName);

            if (category.toLocaleLowerCase() === ProductTypeEnum.ALL.toLocaleLowerCase()) {
                console.log("Category is: " + category + " Enum is: " + ProductTypeEnum.ALL + " Product is: " + product.productName);
                return !searchQuery || product.productName?.toLowerCase().includes(lowercasedQuery);
            }
          
            // Matches category from the enum key
            const matchesCategory = product.category === category;
          
            // Matches search query (case-insensitive)
            const matchesQuery = !searchQuery || product.productName?.toLowerCase().includes(lowercasedQuery);
          
            return matchesCategory && matchesQuery;
        });
        setFilteredProducts(filtered);
    }, [searchQuery, category, products]);

    return (
        <div className="min-h-screen bg-white">
            {/* Products Display */}
            <main className="mt-8 p-4">
                {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                    <Card
                        key={product.id}
                        className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:cursor-pointer"
                        onClick={() => router.push(`/product/${product.id}`)}
                    >
                        <div className="mb-4 self-center">
                        <img src={product.photo ?? ImageStorageService.productPlaceholderImage} alt={product.productName ?? ""} className="w-48 h-48 object-cover mb-2" />
                        </div>
                        <div className="mb-4">
                        <h3 className="font-semibold text-lg">{product.productName}</h3>
                        <p className="text-sm text-gray-500">Category: {ProductTypeEnum[product.category as keyof typeof ProductTypeEnum] ?? ProductTypeEnum.NO_CATEGORY}</p>
                        <p className="font-bold mt-2">Price: {formatCurrency(product.pricePerUnit)}</p>
                        </div>
                        <div className="flex justify-between mt-auto">
                        <Button onClick={(e) => {
                            e.stopPropagation();
                            router.push(ROUTES.ADD_ITEM_ON_AUCTION(product.id))
                        }} className="w-1/2 rounded p-2 mr-2">
                            Put Up for Auction
                        </Button>
                        <Button onClick={(e) => {
                            e.stopPropagation();
                            router.push(ROUTES.ADD_ITEM_ON_SALE(product.id))
                        }} className="w-1/2 rounded p-2" variant="outline">
                            Put Up for Sale
                        </Button>
                        </div>
                    </Card>
                    ))}
                </div>
                ) : (
                <NoProductsAvailable />
                )}
            </main>
                  {/* Floating Button for Adding Product */}
            <Button
                onClick={() => router.push(ROUTES.ADD_PRODUCT)}
                className="fixed bottom-8 right-8 rounded-full p-6 shadow-lg"
                variant= "outline"
            >
                <Plus className="h-6 w-6" />
                <span className="ml-2">Add Product</span>
            </Button>
        </div>
    );
}