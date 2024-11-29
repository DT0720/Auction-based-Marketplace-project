import { Wallet } from "@/domain/entities/Wallet";

export interface IWalletRepository {
    createWallet(data: any): Promise<boolean>;
    getWallet(id: number): Promise<Wallet | null>;
    updateWallet(wallet: Wallet): Promise<Wallet>;
    updateWalletBalance(id: number, balance: number): Promise<boolean>;
    deleteWallet(id: string): Promise<boolean>;
}