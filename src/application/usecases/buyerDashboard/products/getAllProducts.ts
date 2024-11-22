import { Product } from "@/domain/entities/Product";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getAll";

async function getAllProducts(): Promise<Product[]> {

   const response = await NetworkUtils.getRequest<ApiResponse<Product[]>>(endpoint);
   
   return response?.data ?? [];
}

export default getAllProducts;