import { Auction } from "@/domain/entities/Auction";
import { Bid } from "@/domain/entities/Bid";
import { Product } from "@/domain/entities/Product";
import { Review } from "@/domain/entities/Review";

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
     * @returns {Promise<{Product, Auction} | null>} - The auction and product if found, otherwise null.
     */
    findById(id: number): Promise<{ product: Product; auction: Auction } | null>;

    /**
     * Finds all auctions.
     * 
     * @returns {Promise<Auction[]>} - The list of all auctions.
     */
    findAll(): Promise<Auction[]>;

    /**
     * Finds all products on auction.
     * 
     * @returns {Promise<{Product, Auction}[] | null>} - The list of auctions and products if found, otherwise empty list.
     */
    findAllProductsOnAuction(): Promise<{ product: Product; auction: Auction }[]>;

    /**
     * Finds all products on auction with reviews and bidders.
     * 
     * @returns {Promise<{Product, Auction, User[], Review[]}[]>} - The auction, products, bidders, and reviews if found, otherwise empty list.
     */
    findProductByIdWithDetails(productId: Number): Promise<{ reviews: Review[]; bids: Bid[] } | null>;
}