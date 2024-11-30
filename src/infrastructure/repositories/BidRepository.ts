import { IBidRepository } from "@/application/repositories/IBidRepository";
import { Bid } from "@/domain/entities/Bid";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";

export class BidRepository implements IBidRepository{

    async createBid(auction_id: number, buyer_id: number, price: number): Promise<boolean> {

        console.log("Creating bid" + auction_id + " " + buyer_id + " " + price);

        const body = {
            auction_id: auction_id,
            buyer_id: buyer_id,
            price: new Prisma.Decimal(price), // Use Prisma.Decimal for decimal fields  
            created_at: new Date().toISOString()
        }

        console.log(JSON.stringify(body));  // Log the bid data

        try{
            await prisma.bid.create({
                data: {
                    auction_id: auction_id,
                    buyer_id: buyer_id,
                    price: new Prisma.Decimal(price), // Use Prisma.Decimal for decimal fields  
                    created_at: new Date().toISOString()
                }
            }); // Create a new bid
            return true;
        }catch(error){
            console.log(error);
            return false;
        }
    }
    async getBidsByAuctionId(auction_id: number): Promise<Bid[]> {
        try{
            const bids = await prisma.bid.findMany({
                where: {
                    auction_id: auction_id
                }
            }); // Get all bids

            if(!bids){
                return [];
            }
            return bids.map(bid => Bid.fromJson(bid));
        }catch(error){
            console.log(error);
            return [];
        }
    }

    async placeBidAndUpdateWallet(userId: number, buyerId: number,auctionId: number, bidAmount: number, increment: number): Promise<boolean> {
        try {
            await prisma.$transaction(async (prisma) => {
                // Step 1: Find the user's wallet and ensure they have enough balance
                const wallet = await prisma.wallet.findUnique({
                    where: { user_id: userId },
                });
    
                if (!wallet) {
                    throw new Error(`Wallet not found for user with ID: ${userId}`);
                }
                console.log("Wallet balance: " + wallet.current_balance + "creating bid: " + bidAmount);
                // Step 2: Create a new bid
                await prisma.bid.create({
                    data: {
                        auction_id: auctionId,
                        buyer_id: buyerId,
                        price: new Prisma.Decimal(bidAmount),
                        created_at: new Date().toISOString()
                    },
                });
    
                console.log("Bid created successfully " + bidAmount + " " + auctionId + " " + buyerId + " Now updating wallet balance");
                // Step 3: Update the wallet balance
                await prisma.wallet.update({
                    where: { user_id: userId },
                    data: {
                        current_balance: (increment === 0) 
                        ? Number(wallet.current_balance) - Number(bidAmount)
                        : Number(wallet.current_balance) - Number(increment),
                    },
                });

                console.log("Wallet balance updated successfully" + (Number(wallet.current_balance) - Number(new Prisma.Decimal(bidAmount))));
            });
    
            // If transaction succeeds, return true
            return true;
        } catch (error) {
            console.error("Error placing bid and updating wallet balance in transaction:", error);
            // If transaction fails, return false
            return false;
        }
    }
}