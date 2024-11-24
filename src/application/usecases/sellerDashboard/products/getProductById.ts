import { Product } from "@/domain/entities/Product";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getById/";

async function getProductById(id: number): Promise<Product | null> {

   const response = await NetworkUtils.getRequest<ApiResponse<Product>>(endpoint + id);
   
   return response?.data ?? null;
}

export default getProductById;