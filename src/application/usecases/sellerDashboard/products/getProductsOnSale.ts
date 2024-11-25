import { Product } from "@/domain/entities/Product";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getAll/on_sale/";

async function getProductsOnSale(): Promise<Product[]> {

   const response = await NetworkUtils.getRequest<ApiResponse<Product[]>>(endpoint);
   
   return response?.data ?? [];
}

export default getProductsOnSale;