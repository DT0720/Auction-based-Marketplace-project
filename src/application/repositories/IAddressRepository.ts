import { Address } from "@/domain/entities/Address";

/**
 * Interface representing the Address repository.
 * Provides methods for managing Address entities.
 */
export interface IAddressRepository {
    /**
     * Creates a new Address entity.
     * 
     * @param address - The Address entity to create.
     * @returns A Promise that resolves to the created `Address` entity if successful, otherwise `null`.
     */
    create(address: Address): Promise<Address | null>;

    /**
     * Updates an existing Address entity.
     * 
     * @param address - The Address entity with updated information.
     * @returns A Promise that resolves to `true` if the update is successful, otherwise `false`.
     */
    update(address: Address): Promise<boolean>;

    /**
     * Deletes an Address entity by its ID.
     * 
     * @param id - The unique identifier of the Address to delete.
     * @returns A Promise that resolves to `true` if the deletion is successful, otherwise `false`.
     */
    delete(id: number): Promise<boolean>;

    /**
     * Finds an Address entity by its ID.
     * 
     * @param id - The unique identifier of the Address to find.
     * @returns A Promise that resolves to the `Address` entity if found, otherwise `null`.
     */
    findById(id: number): Promise<Address | null>;

    /**
     * Finds all Address entities associated with a specific user ID.
     * 
     * @param userId - The unique identifier of the user whose addresses are to be found.
     * @returns A Promise that resolves to an array of `Address` entities associated with the user.
     */
    findByUserId(userId: number): Promise<Address[]>;
}
