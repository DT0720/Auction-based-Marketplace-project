import { IBidRepository } from "@/application/repositories/IBidRepository";
import { Bid } from "@/domain/entities/Bid";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";

export class BidRepository implements IBidRepository{

    async createBid(auction_id: number, user_id: number, price: number): Promise<boolean> {

        const body = {
            auction_id: auction_id,
            buyer_id: user_id,
            price: new Prisma.Decimal(price), // Use Prisma.Decimal for decimal fields  
            created_at: new Date().toISOString()
        }

        console.log(JSON.stringify(body));  // Log the bid data

        try{
            await prisma.bid.create({
                data: {
                    auction_id: auction_id,
                    buyer_id: user_id,
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
                throw new Error("Error getting bids");
            }
            return bids.map(bid => Bid.fromJson(bid));
        }catch(error){
            console.log(error);
            return [];
        }
    }
}