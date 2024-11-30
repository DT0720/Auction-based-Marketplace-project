import { Order } from "@/domain/entities/Order"; 
export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  getById(id: number): Promise<Order | null>;
  getByBuyerId(buyerId: number): Promise<Order[]>;
  update(order: Order): Promise<Order>;
  delete(id: number): Promise<void>;
}
