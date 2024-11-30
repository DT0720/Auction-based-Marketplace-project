import { IAuctionRepository } from '@/application/repositories/IAuctionRepository';
import { IOrderDetailsRepository } from '@/application/repositories/IOrderDetailsRepository';
import { IOrderRepository } from '@/application/repositories/IOrderRepository';
import { Order } from '@/domain/entities/Order';
import { User } from '@/domain/entities/User';
import { OrderStatusEnum } from '@/domain/enums/OrderStatusEnum';
import { AuctionRepository } from '@/infrastructure/repositories/AuctionRepository';
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository';

describe('UserRepository', () => {
  let orderRepository: IOrderRepository;

  beforeEach(() => {
    orderRepository = new OrderRepository(); // Uses the global prisma mock
  });

  it('should create an order', async () => {
    // Arrange
    const mockUser = {
        buyer_id: 6,
        status: OrderStatusEnum.Pending,
        total_amount: 310.23
    };

    // Act
    const products = await orderRepository.create(Order.fromJson(mockUser));

    console.log("Test is: " + JSON.stringify(products));
    // if(success){
    //   const user = await userRepository.findById(2);
    //   console.log(user);
    // }
  });
});
