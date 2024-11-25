'use client';

import { getProductById } from "@/application/usecases/sellerDashboard/products/getProductById";
import { Button } from "@/components/ui/button";
import ReviewBox from "@/components/ui/custom/ReviewBox";
import { Input } from "@/components/ui/input";
import { Product } from "@/domain/entities/Product";
import useAuth from "@/hooks/use-auth";
import { useLoader } from "@/hooks/use-loader";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import { formatCurrency } from "@/lib/stringUtils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id; // Get the product ID from the URL parameters
  const [product, setProduct] = useState<Product | null>(null);
  const { showLoader, hideLoader } = useLoader();
  const [rating, setRating] = useState<number>(4.5);
  const [totalReviews, setTotalReview] = useState<number>(10);
  const { user } = useAuth();

  const isBuyer = user?.type.toLocaleLowerCase() === "b";
  const isSeller = user?.type.toLocaleLowerCase() === "s";

  useEffect(() => {
    // Fetch the product details using the ID from the params
    const fetchProductDetails = async () => {
      if (typeof id === 'string') {
        try {
          showLoader(); // Show loader while fetching data
          const productData = await getProductById(parseInt(id, 10)); // Fetch product details by ID
          setProduct(productData); // Set the fetched product data to the state
        } catch (error: any) {
          console.error('Error fetching product:', error.message);
        } finally {
          hideLoader(); // Hide loader after fetching is done
        }
      } else {
        hideLoader(); // Hide loader if ID is not valid
      }
    };

    fetchProductDetails();
  }, [id]); // Add dependencies to ensure the function runs correctly

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white border border-gray-300 rounded-lg shadow-md p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="md:w-1/2 w-full flex flex-col items-center">
            <img
              src={product.photo ?? ImageStorageService.productPlaceholderImage}
              alt={product.productName ?? ""}
              className="object-cover rounded-lg w-full mb-4 h-full"
            />
          </div>
          <div className="md:w-1/2 w-full flex flex-col justify-between">
            <h1 className="text-3xl font-bold mb-4 text-gray-600">{product.productName}</h1>
            <p className="text-lg text-gray-500 mb-4">{product.category}</p>
            <p className="text-lg text-gray-700 mb-6">{product.description}</p>
            <ReviewBox rating={rating} totalReviews={totalReviews}/>
            <div className="text-3xl font-bold text-gray-600 mb-6">{formatCurrency(product.pricePerUnit)}</div>
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="mr-2 text-lg font-medium text-gray-700">Quantity:</label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                defaultValue="1"
                className="w-20"
              />
            </div>
            {isBuyer && (
              <Button className="w-full" variant= "outline">Buy Now</Button>
            )}
            {isSeller && (
              <div className="flex flex-col space-y-4 mt-4">
                <Button className="w-full" variant= "outline">Put Up for Auction</Button>
                <Button className="w-full">Put Up for Sale</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
