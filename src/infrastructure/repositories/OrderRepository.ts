// src/infrastructure/repositories/OrderRepository.ts

import { prisma } from '@/infrastructure/database/prisma';
import { Order } from '../../domain/entities/Order';

// Define the OrderRepository class responsible for interacting with the orders table in the database
export class OrderRepository {
  // Method to create a new order in the database
  async createOrder(orderData: any): Promise<Order> {
    // Use Prisma to create a new order record
    const order = await prisma.orders.create({
      data: orderData,
    });
    // Convert the created order record to an Order instance and return it
    return Order.fromJson(order);
  }

  // Method to update the status of an existing order in the database
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    // Use Prisma to update the order status
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: { status },
    });
    // Convert the updated order record to an Order instance and return it
    return Order.fromJson(order);
  }
}