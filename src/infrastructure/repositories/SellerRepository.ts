import { ISellerRepository } from "@/application/repositories/ISellerRepository";
import { Seller } from "@/domain/entities/Seller";

export class SellerRepository implements ISellerRepository {
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async create(user_id: number): Promise<boolean> {
        return true;
    }
    async findById(id: string): Promise<Seller> {
        return new Seller(1, 1);
    }
    
}