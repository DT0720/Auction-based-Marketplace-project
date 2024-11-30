import { ISellerRepository } from "@/application/repositories/ISellerRepository";
import { Seller } from "@/domain/entities/Seller";
import { prisma } from "../database/prisma";

export class SellerRepository implements ISellerRepository {
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async create(user_id: number): Promise<boolean> {
        try{
            await prisma.seller.create({
                data: {
                    user_id: user_id
                }
            });
            return true;
        }catch(e : any){
            console.log(e.trace());
            return false;
        }
    }
    async findById(_user_id: number): Promise<Seller | null> {
        try{
            
            const seller = await prisma.seller.findFirst({ 
                where: {
                    user_id: _user_id
                }
            });

            return Seller.fromJson(seller);
        }catch(e){
            console.log(e);
            return null;
        }
    }

    async findUserIdBySellerId(seller_id: number): Promise<number | null> {
        try{
            const seller = await prisma.seller.findFirst({
                where: {
                    id: seller_id
                }
            });
            return seller?.user_id ?? null;
        }catch(e){
            console.log(e);
            return null;
        }
    }
    
}