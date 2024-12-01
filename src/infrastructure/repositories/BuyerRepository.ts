import { IBuyerRepository } from "@/application/repositories/IBuyerRepository";
import { Buyer } from "@/domain/entities/Buyer";
import { prisma } from "../database/prisma";

export class BuyerRepository implements IBuyerRepository {
    async create(user_id: number): Promise<boolean> {
        try{
            await prisma.buyer.create({
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
    async delete(id: string): Promise<boolean> {
        return true;
    }
    async findUserIdBybuyerId(buyer_id: number): Promise<number | null> {
        try{
            const buyer = await prisma.buyer.findFirst({
                where: {
                    id: buyer_id
                }
            });
            return buyer?.user_id ?? null;
        }catch(e){
            console.log(e);
            return null;
        }
    }
    async findById(id: number): Promise<Buyer | null> {
        try{
            const buyer = await prisma.buyer.findFirst({
                where: {
                    user_id: id
                }
            });
            return Buyer.fromJson(buyer);
        }catch(e){
            console.log(e);
            return null;
        }
    }
}