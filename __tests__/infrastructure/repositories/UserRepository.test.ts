import { User } from '@/domain/entities/User';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository(); // Uses the global prisma mock
  });

  it('should create a user and then fetch the user by ID', async () => {
    // Arrange
    const mockUser = {
      name: 'Hello, it is me',
      email: 'john.doe@exam.com',
      password: 'password',
      age: 12,
      gender: 1,
      type: 'B',
      phone: '1234567890',
      photo: null,
    };
    // Act
    const success = await userRepository.create(User.fromJson(mockUser));

    if(success){
      const user = await userRepository.findById(2);
      console.log(user);
    }
  });
});
