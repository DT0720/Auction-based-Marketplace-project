import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";
import { sendOutbidNotification } from '@/infrastructure/services/NotificationService';
import { BidRepository } from '@/infrastructure/repositories/BidRepository';

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

  if (response?.data) {
    // Notify the last bidder
    const lastBidderId = await getLastBidderId(auction_id);
    console.log(`Last bidder ID: ${lastBidderId}`);
    if (lastBidderId && lastBidderId !== buyer_id) {
      console.log(`Sending outbid notification to bidder ${lastBidderId}`);
      await sendOutbidNotification(lastBidderId, buyer_id, auction_id, bidAmount);
    }
  }

  return response?.data ?? 0;
}

const bidRepository = new BidRepository();

async function getLastBidderId(auctionId: number): Promise<number | null> {
  const bidHistory = await bidRepository.getBidsByAuctionId(auctionId);
  console.log(`Bid history: ${JSON.stringify(bidHistory)}`);
  const lastBid = bidHistory.length > 0 ? bidHistory[bidHistory.length - 1] : null;
  return lastBid ? lastBid.buyer_id : null;
}
