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
    async findById(id: number): Promise<Buyer | null> {
        try{
            const buyer = await prisma.buyer.findUnique({
                where: {
                    id: id
                }
            });
            return Buyer.fromJson(buyer);
        }catch(e){
            console.log(e);
            return null;
        }
    }
}