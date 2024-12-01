import { Buyer } from "@/domain/entities/Buyer";

/**
 * Interface representing the Buyer repository.
 * Provides methods for creating, deleting, and retrieving Buyer-related information.
 */
export interface IBuyerRepository {
    /**
     * Creates a new Buyer entity.
     *
     * @param user_id - The ID of the user to associate with the Buyer.
     * @returns A Promise that resolves to `true` if the creation is successful, otherwise `false`.
     */
    create(user_id: number): Promise<boolean>;

    /**
     * Deletes a Buyer entity by its ID.
     *
     * @param id - The unique identifier of the Buyer to delete.
     * @returns A Promise that resolves to `true` if the deletion is successful, otherwise `false`.
     */
    delete(id: string): Promise<boolean>;

    /**
     * Finds a Buyer entity by its ID.
     *
     * @param id - The unique identifier of the Buyer to find.
     * @returns A Promise that resolves to the `Buyer` entity if found, otherwise `null`.
     */
    findById(id: number): Promise<Buyer | null>;

    /**
     * Finds the user ID associated with a given Buyer ID.
     *
     * @param buyer_id - The unique identifier of the Buyer.
     * @returns A Promise that resolves to the user ID if found, otherwise `null`.
     */
    findUserIdBybuyerId(buyer_id: number): Promise<number | null>;
}
