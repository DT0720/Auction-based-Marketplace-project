import { IBidRepository } from "@/application/repositories/IBidRepository";
import { Bid } from "@/domain/entities/Bid";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";

/**
 * Repository implementation for managing bids.
 */
export class BidRepository implements IBidRepository {
    /**
     * Creates a new bid for an auction.
     *
     * @param auction_id - The ID of the auction for which the bid is being placed.
     * @param buyer_id - The ID of the buyer placing the bid.
     * @param price - The bid amount.
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     */
    async createBid(
        auction_id: number,
        buyer_id: number,
        price: number
    ): Promise<boolean> {
        console.log("Creating bid" + auction_id + " " + buyer_id + " " + price);

        const body = {
            auction_id: auction_id,
            buyer_id: buyer_id,
            price: new Prisma.Decimal(price),
            created_at: new Date().toISOString(),
        };

        console.log(JSON.stringify(body)); // Log the bid data

        try {
            await prisma.bid.create({
                data: {
                    auction_id: auction_id,
                    buyer_id: buyer_id,
                    price: new Prisma.Decimal(price),
                    created_at: new Date().toISOString(),
                },
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Retrieves all bids for a specific auction.
     *
     * @param auction_id - The ID of the auction.
     * @returns A promise that resolves to an array of `Bid` objects.
     */
    async getBidsByAuctionId(auction_id: number): Promise<Bid[]> {
        try {
            const bids = await prisma.bid.findMany({
                where: {
                    auction_id: auction_id,
                },
            });

            if (!bids) {
                return [];
            }
            return bids.map((bid) => Bid.fromJson(bid));
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    /**
     * Places a bid for an auction and updates the user's wallet balance in a transaction.
     *
     * @param userId - The ID of the user placing the bid.
     * @param buyerId - The ID of the buyer associated with the bid.
     * @param auctionId - The ID of the auction for which the bid is being placed.
     * @param bidAmount - The amount of the bid.
     * @param increment - The increment to adjust the wallet balance (if applicable).
     * @returns A promise that resolves to a boolean indicating the success of the operation.
     */
    async placeBidAndUpdateWallet(
        userId: number,
        buyerId: number,
        auctionId: number,
        bidAmount: number,
        increment: number
    ): Promise<boolean> {
        try {
            await prisma.$transaction(async (prisma) => {
                // Step 1: Find the user's wallet and ensure they have enough balance
                const wallet = await prisma.wallet.findUnique({
                    where: { user_id: userId },
                });

                if (!wallet) {
                    throw new Error(`Wallet not found for user with ID: ${userId}`);
                }

                console.log(
                    "Wallet balance: " +
                    wallet.current_balance +
                    "creating bid: " +
                    bidAmount
                );

                // Step 2: Create a new bid
                await prisma.bid.create({
                    data: {
                        auction_id: auctionId,
                        buyer_id: buyerId,
                        price: new Prisma.Decimal(bidAmount),
                        created_at: new Date().toISOString(),
                    },
                });

                console.log(
                    "Bid created successfully " +
                    bidAmount +
                    " " +
                    auctionId +
                    " " +
                    buyerId +
                    " Now updating wallet balance"
                );

                // Step 3: Update the wallet balance
                await prisma.wallet.update({
                    where: { user_id: userId },
                    data: {
                        current_balance:
                            increment === 0
                                ? Number(wallet.current_balance) - Number(bidAmount)
                                : Number(wallet.current_balance) - Number(increment),
                    },
                });

                console.log(
                    "Wallet balance updated successfully" +
                    (Number(wallet.current_balance) -
                        Number(new Prisma.Decimal(bidAmount)))
                );
            });

            return true;
        } catch (error) {
            console.error(
                "Error placing bid and updating wallet balance in transaction:",
                error
            );
            return false;
        }
    }
}
