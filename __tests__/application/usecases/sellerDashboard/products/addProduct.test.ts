// import { IAuctionRepository } from '@/application/repositories/IAuctionRepository';
// import { AuctionRepository } from '@/infrastructure/repositories/AuctionRepository';
// import { Auction } from '@/domain/entities/Auction';

// describe('ImageStoreService', () => {
//   let auctionRepository: IAuctionRepository;

//   beforeEach(() => {
//     auctionRepository = new AuctionRepository();
//   });

//   it('should create an auction', async () => {
//     // Arrange
//     const mockAuction = {
//       product_id: 30,
//       seller_id: 1,
//       buy_it_now_price: "300",
//       minimum_price: "200",
//       status: true,
//       start_time: new Date().toISOString(),
//       end_time: new Date().toISOString(),
//     };
//     // Act

//     console.log(Auction.fromJson(mockAuction)); 

//     const auction = await auctionRepository.create(Auction.fromJson(mockAuction));
//     console.log("Test is: " + auction);

//     // try{
//     //   const auction = await auctionRepository.create(Auction.fromJson(mockAuction));
//     //   console.log("Test is: " + auction);
//     // }catch(error){
//     //   console.log(error);
//     // }


//     // if(success){
//     //   const user = await userRepository.findById(2);
//     //   console.log(user);
//     // }
//   });
// });
