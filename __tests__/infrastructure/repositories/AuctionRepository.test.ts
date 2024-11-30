import { IAuctionRepository } from '@/application/repositories/IAuctionRepository';
import { User } from '@/domain/entities/User';
import { AuctionRepository } from '@/infrastructure/repositories/AuctionRepository';

describe('UserRepository', () => {
  let auctionRepository: IAuctionRepository;

  beforeEach(() => {
    auctionRepository = new AuctionRepository(); // Uses the global prisma mock
  });

  it('should fetch the products on Auction', async () => {
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
    const products = await auctionRepository.findAllProductsOnAuction();

    console.log("Test is: " + JSON.stringify(products));
    // if(success){
    //   const user = await userRepository.findById(2);
    //   console.log(user);
    // }
  });
});
