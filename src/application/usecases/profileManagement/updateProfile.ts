import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IHashingService } from '@/application/services/IHashingService';
import { User } from '@/domain/entities/User';
import { UserAuthException } from '@/domain/errors/UserAuthException';

/**
 * A class to handle user profile updates, including updating name, image, and general profile information.
 */
export class UpdateProfile {
  private userRepository: IUserRepository;
  private hashingService: IHashingService;

  /**
   * Creates an instance of the UpdateProfile class.
   * 
   * @param userRepository - The repository for managing user-related database operations.
   * @param hashingService - The service used for hashing data, such as passwords.
   */
  constructor(userRepository: IUserRepository, hashingService: IHashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  /**
   * Updates the user's name.
   * 
   * @param data - The data containing the updated name for the user.
   * 
   * @returns A promise that resolves to `false` (currently unimplemented).
   */
  async updateName(data: any): Promise<boolean> {
    const user = User.fromJson(data);
    return false;
  }

  /**
   * Updates the user's profile image.
   * 
   * @param data - The data containing the updated image for the user.
   * 
   * @returns A promise that resolves to `false` (currently unimplemented).
   */
  async updateImage(data: any): Promise<boolean> {
    return false;
  }

  /**
   * Updates the user's profile information (e.g., name, email, etc.).
   * 
   * @param data - The data containing the updated user profile information.
   * 
   * @returns A promise that resolves to `true` if the profile was successfully updated, or throws a `UserAuthException` if the update failed.
   * 
   * @throws {UserAuthException} If the profile update fails.
   */
  async updateProfile(data: any): Promise<boolean> {
    
    const user = User.fromJson(data);

    const success = await this.userRepository.update(user);
    
    if (!success) {
      throw new UserAuthException('Profile update failed');
    }

    return success;
  }

}
