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
    async findById(id: string): Promise<Buyer> {
        return new Buyer(1, 1);
    }

    static fromJson(data: any): Buyer {
        return new Buyer(data.id, data.user_id);
    }
}