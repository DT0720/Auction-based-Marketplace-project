import { Product } from "@/domain/entities/Product";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getAll";

async function getAllProducts(): Promise<Product[]> {

   const response = NetworkUtils.getRequest<ApiResponse<Product[]>>(endpoint);

   if(response?.data == null){
    
   }
   return response?.data;
}

export default getAllProducts;