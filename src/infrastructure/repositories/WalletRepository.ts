import { IWalletRepository } from "@/application/repositories/IWalletRepository";
import { Wallet } from "@/domain/entities/Wallet";
import { prisma } from "../database/prisma";

/**
 * Implementation of the IWalletRepository interface using Prisma ORM to handle wallet-related database operations.
 */

export class WalletRepository implements IWalletRepository {
    /**
     * Creates a new wallet in the system.
     *
     * @param {any} data - The data required to create the wallet, including user_id, current_balance, and optional payment details.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the wallet was successfully created, otherwise `false`.
     */

    async createWallet(data: any): Promise<boolean> {
        try {
            const createdWallet = await prisma.wallet.create({
                data: {
                    user_id: data.user_id,
                    current_balance: data.current_balance,
                    ...(data.payment_type && { payment_type: data.payment_type }),
                    ...(data.card_number && { card_number: data.card_number }),
                    ...(data.expiry_date && { expiry_date: data.expiry_date }),
                    ...(data.cvv && { cvv: data.cvv }),
                    ...(data.email && { email: data.email }),
                    ...(data.password && { password: data.password }),
                },
            });

            if (!createdWallet) {
                throw new Error("Error creating wallet");
            }
            return true;
        } catch (e: any) {
            console.log("Error from WalletRepository");
            console.log(e);
            return false;
        }
    }

    /**
     * Deletes a wallet by its unique ID.
     *
     * @param {string} id - The unique ID of the wallet to be deleted.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the wallet was successfully deleted, otherwise `false`.
     */

    async deleteWallet(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * Retrieves a wallet by the user ID.
     *
     * @param {number} _id - The unique user ID associated with the wallet.
     * @returns {Promise<Wallet | null>} - A promise that resolves to the wallet entity if found, or `null` if not found.
     */

    async getWallet(_id: number): Promise<Wallet | null> {
        const wallet = await prisma.wallet.findUnique({
            where: { user_id: _id },
        });
        return wallet ? Wallet.fromJson(wallet) : null;
    }

    /**
     * Updates the balance of a wallet by user ID.
     *
     * @param {number} _id - The unique user ID associated with the wallet.
     * @param {number} balance - The new balance to be set for the wallet.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the balance was successfully updated, otherwise `false`.
     */

    async updateWalletBalance(_id: number, balance: number): Promise<boolean> {
        try {
            const updatedWallet = await prisma.wallet.update({
                where: { user_id: _id },
                data: {
                    current_balance: balance,
                },
            });

            // If the update is successful, return true
            return updatedWallet !== null;
        } catch (error) {
            console.error("Error updating wallet balance:", error);
            // Return false if there was an error (e.g., wallet not found)
            return false;
        }
    }

    /**
     * Decrements the balance of a wallet by user ID.
     *
     * @param {number} _id - The unique user ID associated with the wallet.
     * @param {number} decrement - The amount to decrement from the wallet's balance.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the balance was successfully decremented, otherwise `false`.
     */

    async decrementWalletBalance(
        _id: number,
        decrement: number
    ): Promise<boolean> {
        try {
            // Get the current wallet balance
            const wallet = await prisma.wallet.findUnique({
                where: { user_id: _id },
            });

            // If the wallet doesn't exist, return false
            if (!wallet) {
                console.error("Wallet not found for user ID:", _id);
                return false;
            }

            // Convert the Decimal current_balance to a number for comparison
            const currentBalance = wallet.current_balance.toNumber();

            // Check if the decrement is greater than the current balance
            if (decrement > currentBalance) {
                console.error("Decrement value exceeds current balance.");
                return false; // Return false if decrement is greater than current balance
            }

            // Proceed to update the wallet balance
            const updatedWallet = await prisma.wallet.update({
                where: { user_id: _id },
                data: {
                    current_balance: currentBalance - decrement, // Subtract the decrement
                },
            });

            // If the update is successful, return true
            return updatedWallet !== null;
        } catch (error) {
            console.error("Error decrementing wallet balance:", error);
            return false; // Return false if an error occurs
        }
    }

    /**
     * Updates an existing wallet in the system (currently not implemented).
     *
     * @param {Wallet} wallet - The wallet entity with updated details.
     * @returns {Promise<Wallet>} - A promise that resolves to the updated wallet entity.
     * @throws {Error} - Throws an error since this method is not yet implemented.
     */

    async updateWallet(wallet: Wallet): Promise<Wallet> {
        throw new Error("Method not implemented.");
    }
}
