import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/auction/place_bid/";

/**
 * Places a bid in an auction for a specific buyer and user.
 *
 * @async
 * @function placeBid
 * @param {number} buyer_id - The ID of the buyer placing the bid.
 * @param {number} auction_id - The ID of the auction where the bid is being placed.
 * @param {number} user_id - The ID of the user placing the bid.
 * @param {number} bidAmount - The amount of the bid to place.
 * @returns {Promise<number>} A promise that resolves to the bid ID or `0` if the request fails.
 *
 * @throws {Error} Throws an error if any of the provided parameters are invalid or if the bid amount is not greater than 0.
 *
 * @description This function sends a request to place a bid on a specific auction. It validates the input parameters 
 * (such as the buyer ID, auction ID, user ID, and bid amount) and sends a POST request to the server. If the bid is 
 * successfully placed, it returns the bid ID; otherwise, it returns `0`.
 *
 * @example
 * try {
 *     const bidId = await placeBid(123, 456, 789, 100);
 *     console.log(`Bid placed successfully with ID: ${bidId}`);
 * } catch (error) {
 *     console.error('Error placing bid:', error.message);
 * }
 */
export async function placeBid(buyer_id: number, auction_id: number, user_id: number, bidAmount: number): Promise<number> {
    const body = {
        user_id: user_id,
        buyer_id: buyer_id,
        auction_id: auction_id,
        price: bidAmount,
    };

    if (bidAmount <= 0) {
        throw new Error("Price must be greater than 0");
    }

    if (buyer_id <= 0) {
        throw new Error("Invalid user id");
    }

    if (auction_id <= 0) {
        throw new Error("Invalid auction id");
    }

    if (user_id <= 0) {
        throw new Error("Invalid user id");
    }

    console.log("Placing bid: " + JSON.stringify(body));

    const response = await NetworkUtils.postRequest<ApiResponse<number>>(endpoint, body);

    return response?.data ?? 0;
}


