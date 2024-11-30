import { IOrderRepository } from "@/application/repositories/IOrderRepository";
import { Order } from "@/domain/entities/Order";
import { prisma } from "../database/prisma";


export class OrderRepository implements IOrderRepository {

  constructor() {

  }

  // Create a new order
  async create(order: Order): Promise<Order> {
    const createdOrder = await prisma.orders.create({
      data: {
        buyer_id: order.buyerId,
        offer_id: order.offerId,
        status: order.status,
        total_amount: order.totalAmount,
      },
    });

    return Order.fromJson(createdOrder);
  }

  // Get an order by its ID
  async getById(id: number): Promise<Order | null> {
    const order = await prisma.orders.findUnique({
      where: { id },
    });

    return order ? Order.fromJson(order) : null;
  }

  // Get all orders for a specific buyer
  async getByBuyerId(buyerId: number): Promise<Order[]> {
    const orders = await prisma.orders.findMany({
      where: { buyer_id: buyerId },
    });

    return orders.map((order) => Order.fromJson(order));
  }

  // Update an existing order
  async update(order: Order): Promise<Order> {
    const updatedOrder = await prisma.orders.update({
      where: { id: order.id },
      data: {
        buyer_id: order.buyerId,
        offer_id: order.offerId,
        status: order.status,
        total_amount: order.totalAmount,
      },
    });

    return Order.fromJson(updatedOrder);
  }

  // Delete an order by its ID
  async delete(id: number): Promise<void> {
    await prisma.orders.delete({
      where: { id },
    });
  }
}
