import { Product } from "@/domain/entities/Product";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getAll";

/**
 * Fetches all products from the API.
 *
 * @async
 * @function getAllProducts
 * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances if successful, or an empty array if the request fails.
 *
 * @description This function sends a GET request to the `/api/products/getAll` endpoint to retrieve all products from the server. 
 * It returns a list of products, which are mapped to instances of the `Product` class. If the request fails or no data is received, 
 * it returns an empty array.
 *
 * @example
 * const products = await getAllProducts();
 * if (products.length > 0) {
 *     console.log('Products retrieved successfully:', products);
 * } else {
 *     console.log('No products found.');
 * }
 */
async function getAllProducts(): Promise<Product[]> {

   const response = await NetworkUtils.getRequest<ApiResponse<Product[]>>(endpoint);
   
   return response?.data ?? [];
}

export default getAllProducts;