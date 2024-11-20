import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IHashingService } from '@/application/services/IHashingService';
import { User } from '@/domain/entities/User';
import { UserAuthException } from '@/domain/errors/UserAuthException';

export class UpdateProfile {
  private userRepository: IUserRepository;
  private hashingService: IHashingService;

  constructor(userRepository: IUserRepository, hashingService: IHashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  async updateName(data: any): Promise<boolean> {
    const user = User.fromJson(data);
    return false;
  }

  async updateImage(data: any): Promise<boolean> {
    return false;
  }

  async updateProfile(data: any): Promise<boolean> {
    
    const user = User.fromJson(data);

    const success = await this.userRepository.update(user);
    
    if (!success) {
      throw new UserAuthException('Profile update failed');
    }

    return success;
  }

}
