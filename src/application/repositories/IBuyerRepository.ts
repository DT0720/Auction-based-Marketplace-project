import { Buyer } from "@/domain/entities/Buyer";

export interface IBuyerRepository {
    create(user_id: number): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findById(id: number): Promise<Buyer | null>;
    findUserIdBybuyerId(buyer_id: number): Promise<number | null>;
}