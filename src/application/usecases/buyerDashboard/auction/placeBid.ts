import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";



const endpoint = "/api/auction/place_bid/";

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


