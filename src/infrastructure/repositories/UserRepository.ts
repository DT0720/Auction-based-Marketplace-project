import { User } from '@/domain/entities/User';
import { IUserRepository } from '../../application/repositories/IUserRepository';
import { prisma } from '../database/prisma';

export class UserRepository implements IUserRepository {

    async create(user: User): Promise<boolean> {
        try{
            await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    age: user.age,
                    gender: user.gender ?? 0,
                    secondary_email: user.secondaryEmail,
                    type: user.type,
                    phone: user.phone,
                    photo: user.photo
                }
            }); 
            return true;           
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async update(_user: User): Promise<boolean> {
        try {
            await prisma.user.update({
              where: { user_id: _user.user_id },  // Assuming `id` is the primary key
              data: {
                name: _user.name,
                email: _user.email,
                password: _user.password,
                age: _user.age,
                gender: _user.gender,
                secondary_email: _user.secondaryEmail,
                type: _user.type,
                phone: _user.phone,
                photo: _user.photo,
              },
            });
            return true;  // Indicate success
        } catch (e) {
            console.error('Error updating user:', e);
            return false;  // Indicate failure
        }
    }

    async delete(_id: number): Promise<boolean> {
        return false;
    }
    
    async findById(_id: number): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { user_id: _id },
        });
        return user ? User.fromJson(user) : null;
    }

    async findByEmail(_email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email: _email },
        });
        return user ? User.fromJson(user) : null;
    }

    async findAllUsers(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map(User.fromJson);
    }

}