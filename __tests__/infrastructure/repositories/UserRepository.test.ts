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
      email: 'tawsif.kadir1569@gail.com',
      name: 'Tawsif Kadir',
      password: 'password',
      type: 'B',
      gender: 1,
      age: 23,
      phone: '123456789987654321',
    };
    // Act
    const success = await userRepository.create(User.fromJson(mockUser));

    console.log("Test is: " + success);

    // if(success){
    //   const user = await userRepository.findById(2);
    //   console.log(user);
    // }
  });
});
