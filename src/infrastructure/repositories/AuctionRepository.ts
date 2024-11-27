import { IAuctionRepository } from "@/application/repositories/IAuctionRepository";
import { Auction } from "@/domain/entities/Auction";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";

/**
 * Auction Repository class.
 * Implements methods to interact with the auction database.
 */
export class AuctionRepository implements IAuctionRepository{

    /**
     * Creates a new auction.
     * 
     * @param {Auction} auction - The auction data to create.
     * @returns {Promise<boolean>} - True if the auction is successfully created, otherwise false.
     */
    async create(auction: Auction): Promise<boolean> {
        try{
            const nowAuction = await prisma.auction.create({
                data: {
                    product_id: auction.productId,
                    seller_id: auction.sellerId,
                    minimum_price: new Prisma.Decimal(auction.minimumPrice), // Use Prisma.Decimal for decimal fields
                    buy_it_now_price: new Prisma.Decimal(auction.buyItNowPrice), // Use Prisma.Decimal for decimal fields
                    status: auction.status,
                    start_time: auction.startTime,
                    end_time: auction.endTime,
                }
            });

            if(!nowAuction){
                throw new Error("Error creating auction");
            }

            return true;
        }catch(error){
            console.log(auction);
            return false;
        }
    }

    /**
     * Deletes an auction.
     * 
     * @param {number} id - The ID of the auction to delete.
     * @returns {Promise<boolean>} - True if the auction is successfully deleted, otherwise false.
     */
    async delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * Finds an auction by ID.
     * 
     * @param {number} id - The ID of the auction to find.
     * @returns {Promise<Auction | null>} - The auction object if found, otherwise null.
     */
    async findById(id: number): Promise<Auction | null> {
        throw new Error("Method not implemented.");
    }
    
}