import { User } from '@/domain/entities/User';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository(); // Uses the global prisma mock
  });

  it('should update a user and then fetch the user by ID', async () => {
    // Arrange
    const mockUser = {
      photo: 'uploads/Screenshot 2024-06-30 123855.png',
      email: 'tawsif.kadir18@gmail.com',
    };
    // Act
    const success = await userRepository.update(User.fromJson(mockUser));

    // if(success){
    //   const user = await userRepository.findById(2);
    //   console.log(user);
    // }
  });
});
