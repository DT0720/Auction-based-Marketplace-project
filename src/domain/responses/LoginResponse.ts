import { User } from "../entities/User";

export interface LoginResponse {
    user: User;
    credit: number,
    token: string;
}