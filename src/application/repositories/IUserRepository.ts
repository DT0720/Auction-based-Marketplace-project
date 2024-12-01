import { User } from "../../domain/entities/User";

/**
 * Interface for the User Repository, which defines the methods for interacting with user data.
 */
export interface IUserRepository {
    /**
     * Creates a new user entry.
     * 
     * @param user - The `User` entity to be created.
     * @returns A promise that resolves to a boolean indicating whether the creation was successful.
     */
    create(user: User): Promise<boolean>;

    /**
     * Updates an existing user entry.
     * 
     * @param user - The `User` entity with updated information.
     * @returns A promise that resolves to a boolean indicating whether the update was successful.
     */
    update(user: User): Promise<boolean>;

    /**
     * Deletes a user entry by ID.
     * 
     * @param id - The ID of the user to be deleted.
     * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
     */
    delete(id: number): Promise<boolean>;

    /**
     * Finds a user by its ID.
     * 
     * @param id - The ID of the user.
     * @returns A promise that resolves to the `User` entity, or `null` if not found.
     */
    findById(id: number): Promise<User | null>;

    /**
     * Finds a user by their email address.
     * 
     * @param email - The email address of the user.
     * @returns A promise that resolves to the `User` entity, or `null` if not found.
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Finds all users in the system.
     * 
     * @returns A promise that resolves to an array of `User` entities.
     */
    findAllUsers(): Promise<User[]>;
}
