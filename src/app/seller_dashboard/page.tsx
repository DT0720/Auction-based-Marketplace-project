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

// Main sellerDashboard component
export default function sellerDashboard()
 {
    const [products, setProducts] = useState<Product[]>([]);
    const { showLoader, hideLoader } = useLoader();
    const { buyer_seller_id } = useAuth();
    const router = useRouter();
    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => 
            {
            try {
                showLoader();
                const fetchedProducts = await getProductBySellerId(buyer_seller_id);
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
                {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                    <Card
                        key={product.id}
                        className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:cursor-pointer"
                        onClick={() => router.push(`/product/${product.id}`)}
                    >
                        <div className="mb-4">
                        <img src={product.photo ?? ImageStorageService.productPlaceholderImage} alt={product.productName ?? ""} className="w-full h-auto mb-2" />
                        </div>
                        <div className="mb-4">
                        <h3 className="font-semibold text-lg">{product.productName}</h3>
                        <p className="text-sm text-gray-500">Category: {product.category}</p>
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