import { Order } from "@/domain/entities/Order"; 
import { OrderDetails } from "@/domain/entities/OrderDetails";
export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  getById(id: number): Promise<Order | null>;
  getByBuyerId(buyerId: number): Promise<Order[]>;
  update(order: Order): Promise<Order>;
  delete(id: number): Promise<void>;
  createOrderWithDetailsAndUpdateInventory(
    order: Order,
    orderDetails: OrderDetails[],
    user_id: number
  ): Promise<{ order: Order; orderDetails: OrderDetails[] }>
}
