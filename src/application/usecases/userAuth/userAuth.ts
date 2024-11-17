import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IHashingService } from '@/application/services/IHashingService';
import { User } from '@/domain/entities/User';

export class UserUseCases {
  private userRepository: IUserRepository;
  private hashingService: IHashingService;

  constructor(userRepository: IUserRepository, hashingService: IHashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  async signUp(data: any): Promise<boolean> {
    
    const user = User.fromJson(data);

    user.password = await this.hashingService.hash(user.password);

    const existingUser = await this.userRepository.findByEmail(user.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    return this.userRepository.create(user);
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await this.hashingService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  }
}
