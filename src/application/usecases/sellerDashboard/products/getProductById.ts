import { Product } from "@/domain/entities/Product";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getById/";

export async function getProductById(id: number): Promise<Product | null> {

   const response = await NetworkUtils.getRequest<ApiResponse<Product>>(endpoint + id);
   
   return response?.data ?? null;
}

export async function getProductBySellerId(id: number): Promise<Product[]> {

   const response = await NetworkUtils.getRequest<ApiResponse<Product[]>>(endpoint+ "/by_seller_id/" + id);
   
   return response?.data ?? [];
}

