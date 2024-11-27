import { Auction } from "@/domain/entities/Auction";
import { Product } from "@/domain/entities/Product";
import { User } from "@/domain/entities/User";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getAll/on_auction/";

export async function getProductsOnAuction(): Promise<{product: Product, auction: Auction}[]> {

   const response = await NetworkUtils.getRequest<ApiResponse<{product: Product, auction: Auction}[]>>(endpoint);
   
   return response?.data ?? [];
}

export async function getProductOnAuctionByProductId(id: number): Promise<{product: Product, auction: Auction} | null> {

   const response = await NetworkUtils.getRequest<ApiResponse<{product: Product, auction: Auction}>>(endpoint + id);
   
   return response?.data ?? null;
}

export async function getProductOnAuctionByProductIdWithBiddersAndReviews(id: number): Promise<{product: Product, auction: Auction, bidders: User[]} | null> {

    const response = await NetworkUtils.getRequest<ApiResponse<{product: Product, auction: Auction}>>(endpoint + id);
   
    return response?.data ?? null;
}
