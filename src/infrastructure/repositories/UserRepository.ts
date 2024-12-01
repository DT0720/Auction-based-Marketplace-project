import { User } from '@/domain/entities/User';
import { IUserRepository } from '../../application/repositories/IUserRepository';
import { prisma } from '../database/prisma';
import { BuyerRepository } from './BuyerRepository';
import { SellerRepository } from './SellerRepository';
import { IBuyerRepository } from '@/application/repositories/IBuyerRepository';
import { ISellerRepository } from '@/application/repositories/ISellerRepository';
import { IWalletRepository } from '@/application/repositories/IWalletRepository';
import { WalletRepository } from './WalletRepository';

/**
 * Repository for handling User data.
 */
export class UserRepository implements IUserRepository {

    private buyerRepository: IBuyerRepository = new BuyerRepository();
    private sellerRepository: ISellerRepository = new SellerRepository();
    private walletRepository: IWalletRepository = new WalletRepository();

    /**
     * Creates a new user and associated records (buyer, seller, wallet) in the database.
     * 
     * @param user - The User object to be created.
     * @returns A promise that resolves to `true` if the user was created successfully, or `false` if an error occurs.
     */
    async create(user: User): Promise<boolean> {
        try {
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

                // Create buyer or seller based on user type
                if (user.type.toLocaleLowerCase() === 'b') {
                    await this.buyerRepository.create(createdUser.user_id);
                } else if (user.type.toLocaleLowerCase() === 's') {
                    await this.sellerRepository.create(createdUser.user_id);
                }

                // Create wallet for the user
                const success = await this.walletRepository.createWallet({
                    user_id: createdUser.user_id,
                    current_balance: 0
                });
                console.log("Wallet created: " + success);
            });

            return true;
        } catch (e) {
            console.log("Entering error region from UserRepository");
            console.log(e);
            return false;
        }
    }

    /**
     * Updates an existing user based on the provided User object.
     * 
     * @param _user - The User object containing the updated data.
     * @returns A promise that resolves to `true` if the user was updated successfully, or `false` if an error occurs.
     */
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

            return true;
        } catch (e) {
            console.error("Error updating user:", e);
            return false;
        }
    }

    /**
     * Deletes a user by their ID.
     * 
     * @param _id - The ID of the user to be deleted.
     * @returns A promise that resolves to `false` as deletion functionality is not implemented.
     */
    async delete(_id: number): Promise<boolean> {
        return false;
    }

    /**
     * Finds a user by their ID.
     * 
     * @param _id - The ID of the user to find.
     * @returns A promise that resolves to the User object if found, or `null` if the user does not exist.
     */
    async findById(_id: number): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { user_id: _id },
        });
        return user ? User.fromJson(user) : null;
    }

    /**
     * Finds a user by their email address.
     * 
     * @param _email - The email of the user to find.
     * @returns A promise that resolves to the User object if found, or `null` if the user does not exist.
     */
    async findByEmail(_email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email: _email },
        });
        return user ? User.fromJson(user) : null;
    }

    /**
     * Retrieves all users in the system.
     * 
     * @returns A promise that resolves to an array of all User objects.
     */
    async findAllUsers(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map(User.fromJson);
    }

}
