import { Auction } from "@/domain/entities/Auction";
import { Bid } from "@/domain/entities/Bid";
import { Product } from "@/domain/entities/Product";
import { Review } from "@/domain/entities/Review";
import { User } from "@/domain/entities/User";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getAll/on_auction/";

/**
 * Fetches all products currently on auction.
 *
 * @async
 * @function getProductsOnAuction
 * @returns {Promise<{product: Product, auction: Auction}[]>} A promise that resolves to an array of objects, each containing a `Product` and an `Auction` instance.
 *
 * @description This function sends a GET request to fetch all products that are currently listed in an auction. Each item in the returned array contains the product details and its associated auction details.
 *
 * @example
 * const productsOnAuction = await getProductsOnAuction();
 * console.log('Products on auction:', productsOnAuction);
 */
export async function getProductsOnAuction(): Promise<{product: Product, auction: Auction}[]> {

   const response = await NetworkUtils.getRequest<ApiResponse<{product: Product, auction: Auction}[]>>(endpoint);
   
   return response?.data ?? [];
}

/**
 * Fetches the product and its associated auction details by product ID.
 *
 * @async
 * @function getProductOnAuctionByProductId
 * @param {number} id - The unique ID of the product.
 * @returns {Promise<{product: Product, auction: Auction} | null>} A promise that resolves to an object containing the `Product` and `Auction` instances if found, or `null` if not found.
 *
 * @description This function sends a GET request to fetch the product and its auction details for a specific product identified by its ID. If the product is not found, it returns `null`.
 *
 * @example
 * const productWithAuction = await getProductOnAuctionByProductId(123);
 * if (productWithAuction) {
 *     console.log('Product and auction details:', productWithAuction);
 * } else {
 *     console.log('Product not found.');
 * }
 */
export async function getProductOnAuctionByProductId(id: number): Promise<{product: Product, auction: Auction} | null> {

   const response = await NetworkUtils.getRequest<ApiResponse<{product: Product, auction: Auction}>>(endpoint + id);
   
   return response?.data ?? null;
}

/**
 * Fetches the reviews and bidders for a specific product by product ID.
 *
 * @async
 * @function getReviewAndBiddersByProductId
 * @param {number} id - The unique ID of the product.
 * @returns {Promise<{reviews: Review[], bids: Bid[]} | null>} A promise that resolves to an object containing an array of `Review` instances and an array of `Bid` instances. Returns `null` if the data is not found.
 *
 * @description This function sends a GET request to fetch reviews and bids for a specific product by its ID. If no data is found, it returns `null`.
 *
 * @example
 * const reviewsAndBidders = await getReviewAndBiddersByProductId(123);
 * if (reviewsAndBidders) {
 *     console.log('Reviews and bidders:', reviewsAndBidders);
 * } else {
 *     console.log('No reviews or bids found for this product.');
 * }
 */
export async function getReviewAndBiddersByProductId(id: number): Promise<{reviews: Review[], bids: Bid[]} | null> {

   const response = await NetworkUtils.getRequest<ApiResponse<{reviews: Review[], bids: Bid[]}>>(endpoint + "w_review_bidder/" + id);
   
    return response?.data ?? null;
}
