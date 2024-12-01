import { Seller } from "@/domain/entities/Seller";

/**
 * Interface for the Seller Repository, which defines the methods for interacting with seller data.
 */
export interface ISellerRepository {
    /**
     * Creates a new seller entry with the specified user ID.
     * 
     * @param user_id - The ID of the user associated with the seller.
     * @returns A promise that resolves to a boolean indicating whether the creation was successful.
     */
    create(user_id: number): Promise<boolean>;

    /**
     * Deletes a seller entry by ID.
     * 
     * @param id - The ID of the seller to be deleted.
     * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
     */
    delete(id: string): Promise<boolean>;

    /**
     * Finds a seller by its ID.
     * 
     * @param id - The ID of the seller.
     * @returns A promise that resolves to the `Seller` entity, or `null` if not found.
     */
    findById(id: number): Promise<Seller | null>;

    /**
     * Finds the user ID associated with a seller by the seller's ID.
     * 
     * @param seller_id - The ID of the seller.
     * @returns A promise that resolves to the user ID associated with the seller, or `null` if not found.
     */
    findUserIdBySellerId(seller_id: number): Promise<number | null>;
}
