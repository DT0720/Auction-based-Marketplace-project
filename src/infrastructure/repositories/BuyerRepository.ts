/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBuyerRepository } from "@/application/repositories/IBuyerRepository";
import { Buyer } from "@/domain/entities/Buyer";
import { prisma } from "../database/prisma";

/**
 * Implementation of the IBuyerRepository interface using Prisma ORM.
 * Provides methods for creating, deleting, and retrieving Buyer entities.
 */
export class BuyerRepository implements IBuyerRepository {
    /**
     * Creates a new Buyer entity in the database.
     * 
     * @param user_id - The ID of the user to associate with the Buyer.
     * @returns A Promise that resolves to `true` if the creation is successful, otherwise `false`.
     */
    async create(user_id: number): Promise<boolean> {
        try {
            await prisma.buyer.create({
                data: {
                    user_id: user_id,
                },
            });
            return true;
        } catch (e: any) {
            console.log(e.trace());
            return false;
        }
    }

    /**
     * Deletes a Buyer entity by its ID.
     * 
     * @param id - The unique identifier of the Buyer to delete.
     * @returns A Promise that resolves to `true` if the deletion is successful.
     * Note: This method currently returns `true` without performing any operation.
     */
    async delete(id: string): Promise<boolean> {
        return true;
    }

    /**
     * Finds the user ID associated with a specific Buyer ID.
     * 
     * @param buyer_id - The unique identifier of the Buyer.
     * @returns A Promise that resolves to the user ID if found, otherwise `null`.
     */
    async findUserIdBybuyerId(buyer_id: number): Promise<number | null> {
        try {
            const buyer = await prisma.buyer.findFirst({
                where: {
                    id: buyer_id,
                },
            });
            return buyer?.user_id ?? null;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Finds a Buyer entity in the database by its ID.
     * 
     * @param id - The unique identifier of the Buyer to find.
     * @returns A Promise that resolves to the `Buyer` entity if found, otherwise `null`.
     * Assumes the existence of a static `fromJson` method in the `Buyer` entity class.
     */
    async findById(id: number): Promise<Buyer | null> {
        try {
            const buyer = await prisma.buyer.findFirst({
                where: {
                    user_id: id,
                },
            });
            return Buyer.fromJson(buyer);
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
