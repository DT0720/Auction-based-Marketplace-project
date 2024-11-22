import { User } from '@/domain/entities/User';
import { IUserRepository } from '../../application/repositories/IUserRepository';
import { prisma } from '../database/prisma';
import { BuyerRepository } from './BuyerRepository';
import { SellerRepository } from './SellerRepository';
import { IBuyerRepository } from '@/application/repositories/IBuyerRepository';
import { ISellerRepository } from '@/application/repositories/ISellerRepository';

export class UserRepository implements IUserRepository {

    private buyerRepository: IBuyerRepository = new BuyerRepository();
    private sellerRepository: ISellerRepository = new SellerRepository();

    async create(user: User): Promise<boolean> {
        try{
            await prisma.$transaction(async () => {
                const createdUser = await prisma.user.create({
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
    
                if(user.type.toLocaleLowerCase() === 'b'){
                    await this.buyerRepository.create(createdUser.user_id);
                }else if(user.type.toLocaleLowerCase() === 's'){
                    await this.sellerRepository.create(createdUser.user_id);
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
            // Filter out undefined, null, and excluded keys
            const dataToUpdate = Object.fromEntries(
                Object.entries(_user).filter(([key, value]) => 
                    value !== undefined && value !== null && key !== 'user_id' && key !== 'email'
                )
            );
    
            // Determine where clause
            const whereClause = _user.user_id 
                ? { user_id: _user.user_id } 
                : _user.email 
                    ? { email: _user.email } 
                    : null;
    
            // Validate inputs
            if (!whereClause) {
                console.error("Error: Missing user_id or email for update.");
                return false;
            }
    
            if (Object.keys(dataToUpdate).length === 0) {
                console.error("Error: No fields to update.");
                return false;
            }
    
            await prisma.user.update({
                where: whereClause,
                data: dataToUpdate,
            });
    
            return true;  // Indicate success
        } catch (e) {
            console.error("Error updating user:", e);
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