'use client';

import getProductById from "@/application/usecases/sellerDashboard/products/getProductById";
import { Product } from "@/domain/entities/Product";
import { useLoader } from "@/hooks/use-loader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id; // Get the product ID from the URL parameters
  const [product, setProduct] = useState<Product | null>(null);
  const { showLoader, hideLoader } = useLoader();

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
    <div className="min-h-screen bg-white p-8">
      <div className="border border-gray-300 rounded-lg p-6">
        <img
          src={product.photo ?? "/images/placeholder.jpg"}
          alt={product.productName}
          className="w-full h-auto mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
        <p className="text-lg text-gray-700">Category: {product.category}</p>
        <p className="text-lg text-gray-700">Price: ${product.pricePerUnit.toFixed(2)}</p>
        <p className="text-lg text-gray-700">Rating: {"N/A"} / 5</p>
        <p className="text-lg text-gray-700">Reviews: {0}</p>
      </div>
    </div>
  );
}
