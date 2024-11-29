import { Auction } from "@/domain/entities/Auction";
import { Bid } from "@/domain/entities/Bid";
import { Product } from "@/domain/entities/Product";
import { Review } from "@/domain/entities/Review";
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

export async function getReviewAndBiddersByProductId(id: number): Promise<{reviews: Review[], bids: Bid[]} | null> {

   const response = await NetworkUtils.getRequest<ApiResponse<{reviews: Review[], bids: Bid[]}>>(endpoint + "w_review_bidder/" + id);
   
    return response?.data ?? null;
}
