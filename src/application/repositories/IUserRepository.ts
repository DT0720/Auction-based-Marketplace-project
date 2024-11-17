import { User } from "../../domain/entities/User";

export interface IUserRepository {
    create(user: User): Promise<boolean>;
    update(user: User): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAllUsers(): Promise<User[]>;
}