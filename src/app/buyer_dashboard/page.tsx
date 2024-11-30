"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/domain/entities/Product";
import { Card } from "@/components/ui/card";
import { useLoader } from "@/hooks/use-loader";
import { useRouter } from "next/navigation";
import NoProductsAvailable from "@/components/ui/custom/NoProductsAvailable";
import NoOngoingAuctions from "@/components/ui/custom/NoOngoingAuctions";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import { formatCurrency } from "@/lib/stringUtils";
import getProductsOnSale from "@/application/usecases/sellerDashboard/products/getProductsOnSale";
import { errorMessage, successMessage } from "@/components/ui/custom/Toast";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Auction } from "@/domain/entities/Auction";
import { getProductsOnAuction } from "@/application/usecases/buyerDashboard/products/getProductsOnAuction";
import { ROUTES } from "@/application/routing/routes";
import { useFilters } from "@/hooks/use-filter";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";

// Main BuyerDashboard component
export default function BuyerDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [ongoingAuctions, setOngoingAuctions] = useState<{product: Product, auction: Auction}[]>([]); // State for ongoing auctions
    const { showLoader, hideLoader } = useLoader();
    const { addProductToCart } = useCart(); 
    const { toast } = useToast();   
    const { searchQuery, category } = useFilters();
    const router = useRouter();

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                showLoader();
                const fetchedProducts = await getProductsOnSale();
                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts);
                const ongoingAuctions: {product: Product, auction: Auction}[] = await getProductsOnAuction(); // Fetch ongoing auctions

                setOngoingAuctions(ongoingAuctions); // Set the dummy auctions
            } catch (error: any) {
                console.error('Error fetching products:', error.message);
            } finally {
                hideLoader();
            }
        };
        fetchProducts();
    }, []);

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


    const handleAddToCart = (productId: number) => {
        showLoader();
        try {
            addProductToCart(productId);
            successMessage(toast, 'Product added to cart!');
        }catch(error: any){
            errorMessage(toast, error.message);
        }finally{
            hideLoader();
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Products Display */}
            <main className="mt-8 p-4">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <Card 
                                    key={product.id} 
                                    className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg"
                                    onClick={() => router.push(`/product/${product.id}`)}
                                >
                                    <div className="mb-4 self-center">
                                    <img src={product.photo ?? ImageStorageService.productPlaceholderImage} alt={product.productName ?? ""} className="w-48 h-48 object-cover mb-2" />
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-lg">{product.productName}</h3>
                                        <p className="text-sm text-gray-500">Category: {ProductTypeEnum[product.category as keyof typeof ProductTypeEnum] ?? ProductTypeEnum.NO_CATEGORY}</p>
                                        {/* <p className="text-sm text-gray-500">Rating: {product.rating ? product.rating : 'N/A'} / 5</p>
                                        <p className="text-sm text-gray-500">Reviews: {product.reviewsCount || 0}</p> */}
                                        <p className="font-bold mt-2">Price: {formatCurrency(product.pricePerUnit)}</p>
                                    </div>
                                    <div className="flex justify-end mt-auto">
                                        <Button className="w-full rounded p-2" variant="outline" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product.id)
                                            } 
                                        } >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <NoProductsAvailable />
                    )}
                

                {/* Ongoing Auctions Section */}
                <h2 className="text-xl font-bold mt-8 mb-4">Ongoing Auctions</h2>
                    {ongoingAuctions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {ongoingAuctions.map(({ product, auction }) => (
                        <Card 
                            key={auction.id} 
                            className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(ROUTES.PRODUCT_ON_AUCTION(product.id))
                            }} // Assuming you have a separate auction page
                        >
                            <div className="mb-4">
                            <img 
                                src={product.photo ?? ImageStorageService.productPlaceholderImage} 
                                alt={product.productName ?? ""} 
                                className="w-full h-auto mb-2" 
                            />
                            </div>
                            <div className="mb-4">
                            <h3 className="font-semibold text-lg">{product.productName}</h3>
                            <p className="font-bold mt-2">Starting Bid: {formatCurrency(auction.minimumPrice)}</p>
                            </div>
                        </Card>
                        ))}
                        </div>
                    ) : (
                        <NoOngoingAuctions />
                    )}
            </main>
        </div>
    );
}