import { IAuctionRepository } from '@/application/repositories/IAuctionRepository';
import { addProductOnAuction } from '@/application/usecases/sellerDashboard/products/addProduct';
import { AuctionRepository } from '@/infrastructure/repositories/AuctionRepository';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';
import { Auction } from '@/domain/entities/Auction';

describe('ImageStoreService', () => {
  let imageStorageService: ImageStorageService;
  let auctionRepository: IAuctionRepository;

  beforeEach(() => {
    imageStorageService = new ImageStorageService(); // Uses the global prisma mock
    auctionRepository = new AuctionRepository();
  });

  it('should create an auction', async () => {
    // Arrange
    const mockAuction = {
      product_id: 30,
      seller_id: 1,
      current_price: 200,
      desired_price: 300,
      quantity_for_sale: 10,
      status: 1,
      created_at: Date.now(),
    };
    // Act

    console.log(Auction.fromJson(mockAuction)); 

    const auction = await auctionRepository.create(Auction.fromJson(mockAuction));

    console.log("Test is: " + auction != null);

    // if(success){
    //   const user = await userRepository.findById(2);
    //   console.log(user);
    // }
  });
});
