import { IAddressRepository } from "@/application/repositories/IAddressRepository";
import { Address } from "@/domain/entities/Address";
import { prisma } from "../database/prisma";

/**
 * Implementation of the IAddressRepository interface using Prisma ORM.
 * Provides methods for creating, updating, deleting, and retrieving Address entities.
 */
export class AddressRepository implements IAddressRepository {
    /**
     * Creates a new Address entity in the database.
     *
     * @param address - The Address entity to create.
     * @returns A Promise that resolves to the created `Address` entity if successful, otherwise `null`.
     */
    async create(address: Address): Promise<Address | null> {
        try {
            const createdAddress = await prisma.address.create({
                data: {
                    user_id: address.user_id,
                    flat_no: address.flat_no,
                    house_no: address.house_no,
                    road_no: address.road_no,
                    sector: address.sector,
                    area: address.area,
                    city: address.city,
                    house_name: address.house_name,
                },
            });
            return Address.fromJSON(createdAddress); // Assuming you have a static method to create Address from JSON
        } catch (e: any) {
            console.error("Error creating address:", e);
            return null;
        }
    }

    /**
     * Updates an existing Address entity in the database.
     *
     * @param address - The Address entity with updated information.
     * @returns A Promise that resolves to `true` if the update is successful, otherwise `false`.
     */
    async update(address: Address): Promise<boolean> {
        try {
            await prisma.address.update({
                where: { id: address.id }, // Assuming Address has an id property
                data: {
                    flat_no: address.flat_no,
                    house_no: address.house_no,
                    road_no: address.road_no,
                    sector: address.sector,
                    area: address.area,
                    city: address.city,
                    house_name: address.house_name,
                },
            });
            return true;
        } catch (e: any) {
            console.error("Error updating address:", e);
            return false;
        }
    }

    /**
     * Deletes an Address entity from the database by its ID.
     *
     * @param id - The unique identifier of the Address to delete.
     * @returns A Promise that resolves to `true` if the deletion is successful, otherwise `false`.
     */
    async delete(id: number): Promise<boolean> {
        try {
            await prisma.address.delete({
                where: { id },
            });
            return true;
        } catch (e: any) {
            console.error("Error deleting address:", e);
            return false;
        }
    }

    /**
     * Finds an Address entity in the database by its ID.
     *
     * @param id - The unique identifier of the Address to find.
     * @returns A Promise that resolves to the `Address` entity if found, otherwise `null`.
     */
    async findById(id: number): Promise<Address | null> {
        try {
            const address = await prisma.address.findUnique({
                where: { id },
            });

            return Address.fromJSON(address); // Assuming you have a static method to create Address from JSON
        } catch (e) {
            console.error("Error finding address:", e);
            return null;
        }
    }

    /**
     * Finds all Address entities in the database associated with a specific user ID.
     *
     * @param userId - The unique identifier of the user whose addresses are to be retrieved.
     * @returns A Promise that resolves to an array of `Address` entities associated with the user.
     */
    async findByUserId(userId: number): Promise<Address[]> {
        try {
            const addresses = await prisma.address.findMany({
                where: { user_id: userId }, // Fetch addresses by user ID
            });

            return addresses.map(Address.fromJSON); // Convert each raw address to an Address instance
        } catch (e) {
            console.error("Error fetching addresses by user ID:", e);
            return [];
        }
    }
}
