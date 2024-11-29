import { IWalletRepository } from "@/application/repositories/IWalletRepository";
import { Wallet } from "@/domain/entities/Wallet";
import { prisma } from "../database/prisma";

export class WalletRepository implements IWalletRepository {
    async createWallet(data: any): Promise<boolean> {
        try{
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

            if(!createdWallet){
                throw new Error("Error creating wallet");
            }
            return true;
        }catch(e: any){

            console.log("Error from WalletRepository");
            console.log(e); 
            return false
        }
    }

    async deleteWallet(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async getWallet(_id: number): Promise<Wallet | null> {
        const wallet = await prisma.wallet.findUnique({
            where: { user_id: _id },
        });
        return wallet ? Wallet.fromJson(wallet) : null;
    }

    async updateWallet(wallet: Wallet): Promise<Wallet> {
        throw new Error("Method not implemented.");
    }
}