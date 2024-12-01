import { Bid } from "@/domain/entities/Bid";

/**
 * Interface for the Bid repository, defining methods to interact with bid-related data.
 */
export interface IBidRepository {
    /**
     * Creates a new bid for a specific auction.
     *
     * @param auction_id - The ID of the auction for which the bid is placed.
     * @param buyer_id - The ID of the buyer placing the bid.
     * @param price - The bid amount.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     */
    createBid(
        auction_id: number,
        buyer_id: number,
        price: number
    ): Promise<boolean>;

    /**
     * Retrieves all bids for a specific auction.
     *
     * @param auction_id - The ID of the auction whose bids are to be retrieved.
     * @returns A promise that resolves to an array of `Bid` objects.
     */
    getBidsByAuctionId(auction_id: number): Promise<Bid[]>;

    /**
     * Places a bid for an auction and updates the user's wallet balance.
     *
     * @param userId - The ID of the user placing the bid.
     * @param buyerId - The ID of the buyer associated with the bid.
     * @param auctionId - The ID of the auction for which the bid is placed.
     * @param bidAmount - The amount of the bid.
     * @param increment - The increment amount for the bid.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     */
    placeBidAndUpdateWallet(
        userId: number,
        buyerId: number,
        auctionId: number,
        bidAmount: number,
        increment: number
    ): Promise<boolean>;
}
