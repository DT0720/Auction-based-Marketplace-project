import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/auction/place_bid/";

export async function placeBid(buyer_id: number, auction_id: number, price: number): Promise<boolean> {
    const body = {
        buyer_id: buyer_id,
        auction_id: auction_id,
        price: price
    }

    if (price <= 0) {
        throw new Error("Price must be greater than 0");
    }

    if (buyer_id <= 0) {
        throw new Error("Invalid user id");
    }

    if (auction_id <= 0) {
        throw new Error("Invalid auction id");
    }

    console.log("Placing bid: " + JSON.stringify(body));

    const response = await NetworkUtils.postRequest<ApiResponse<boolean>>(endpoint, body);

    return response?.data ?? false;    
}

