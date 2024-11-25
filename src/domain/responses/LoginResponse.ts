import { User } from "../entities/User";

export interface LoginResponse {
    user: User;
    buyer_seller_id: number;
    credit: number,
    token: string;
}