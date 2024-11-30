import { User } from '@/domain/entities/User';
import { SellerInventoryRepository } from '@/infrastructure/repositories/SellerInventoryRepository';

describe('SellerInventoryRepository', () => {
  let sellerInventory: SellerInventoryRepository;

  beforeEach(() => {
    sellerInventory = new SellerInventoryRepository(); // Uses the global prisma mock
  });

  it('Get seller id by product id', async () => {
    // Act
    const success = await sellerInventory.getSellerIdsByProductIds([22, 5]);

    console.log("Test is: " + JSON.stringify(success));

    // if(success){
    //   const user = await userRepository.findById(2);
    //   console.log(user);
    // }
  });
});
