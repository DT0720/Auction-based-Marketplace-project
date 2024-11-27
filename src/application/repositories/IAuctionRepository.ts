import { Auction } from "@/domain/entities/Auction";

/**
 * Interface for Auction Repository.
 * Provides methods for creating, deleting, and finding auctions.
 */
export interface IAuctionRepository {
    /**
     * Creates a new auction.
     * 
     * @param {Auction} auction - The auction to be created.
     * @returns {Promise<boolean>} - True if the auction is created successfully, otherwise false.
     */
    create(auction: Auction): Promise<boolean>;
    /**
     * Deletes an auction by its ID.
     * 
     * @param {number} id - The ID of the auction to be deleted.
     * @returns {Promise<boolean>} - True if the auction is deleted successfully, otherwise false.
     */
    delete(id: number): Promise<boolean>;
    /**
     * Finds an auction by its ID.
     * 
     * @param {number} id - The ID of the auction to find.
     * @returns {Promise<Auction | null>} - The auction if found, otherwise null.
     */
    findById(id: number): Promise<Auction | null>;
}