import { IAuctionRepository } from "@/application/repositories/IAuctionRepository";
import { Auction } from "@/domain/entities/Auction";
import { prisma } from "../database/prisma";

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
            const nowAuction = prisma.auction.create({
                data: {
                    product_id: auction.productId,
                    created_at: auction.createdAt,
                    desired_price: auction.desiredPrice,
                    current_price: auction.currentPrice,
                    status: auction.status,
                    quantity_for_sale: auction.quantity_for_sale,
                    seller_id: auction.sellerId, // Add the 'seller_id' property with a valid value
                }
            })

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