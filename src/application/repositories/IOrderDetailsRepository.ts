import { OrderDetails } from "@/domain/entities/OrderDetails";

export interface IOrderDetailsRepository {
  create(orderDetails: OrderDetails): Promise<OrderDetails>;
  getByOrderId(orderId: number): Promise<OrderDetails[]>;
  getById(id: number): Promise<OrderDetails | null>;
  update(orderDetails: OrderDetails): Promise<OrderDetails>;
  delete(id: number): Promise<void>;
}
