import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IHashingService } from '@/application/services/IHashingService';
import { User } from '@/domain/entities/User';
import { UserAuthException } from '@/domain/errors/UserAuthException';

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
      throw new UserAuthException('User already exists');
    }

    return this.userRepository.create(user);
  }

  async login(data : any): Promise<User | null> {

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UserAuthException('Invalid email or password');
    }
    const isPasswordValid = await this.hashingService.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UserAuthException('Invalid email or password');
    }

    return user;
  }
}
