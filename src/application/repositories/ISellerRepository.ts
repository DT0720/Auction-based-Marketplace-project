import { Seller } from "@/domain/entities/Seller";

export interface ISellerRepository {
    create(user_id: number): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findById(id: number): Promise<Seller | null>;
}