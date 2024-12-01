import { Wallet } from "@/domain/entities/Wallet";

/**
 * Interface for Wallet Repository to handle wallet-related operations.
 */

export interface IWalletRepository {
    /**
     * Creates a new wallet in the system.
     *
     * @param {any} data - The data required to create a new wallet.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the wallet is successfully created, otherwise `false`.
     */

    createWallet(data: any): Promise<boolean>;

    /**
     * Retrieves a wallet by its unique ID.
     *
     * @param {number} id - The unique ID of the wallet.
     * @returns {Promise<Wallet | null>} - A promise that resolves to the wallet entity if found, or `null` if not found.
     */

    getWallet(id: number): Promise<Wallet | null>;

    /**
     * Updates an existing wallet in the system.
     *
     * @param {Wallet} wallet - The wallet entity with updated details.
     * @returns {Promise<Wallet>} - A promise that resolves to the updated wallet entity.
     */

    updateWallet(wallet: Wallet): Promise<Wallet>;

    /**
     * Updates the balance of a specific wallet.
     *
     * @param {number} id - The unique ID of the wallet.
     * @param {number} balance - The new balance to be updated in the wallet.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the balance is successfully updated, otherwise `false`.
     */

    updateWalletBalance(id: number, balance: number): Promise<boolean>;

    /**
     * Deletes a wallet from the system by its unique ID.
     *
     * @param {string} id - The unique ID of the wallet to be deleted.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the wallet is successfully deleted, otherwise `false`.
     */

    deleteWallet(id: string): Promise<boolean>;
}
