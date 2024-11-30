import { IOrderDetailsRepository } from "@/application/repositories/IOrderDetailsRepository";
import { OrderDetails } from "@/domain/entities/OrderDetails";
import { prisma } from "../database/prisma";


export class OrderDetailsRepository implements IOrderDetailsRepository {

  constructor() {

  }

  // Create a new order detail
  async create(orderDetails: OrderDetails): Promise<OrderDetails> {
    const createdOrderDetails = await prisma.order_details.create({
      data: {
        order_id: orderDetails.orderId,
        product_id: orderDetails.productId,
        quantity: orderDetails.quantity,
        seller_id: orderDetails.sellerId,
      },
    });

    return OrderDetails.fromJson(createdOrderDetails);
  }

  // Get all order details for a specific order
  async getByOrderId(orderId: number): Promise<OrderDetails[]> {
    const orderDetails = await prisma.order_details.findMany({
      where: { order_id: orderId },
    });

    return orderDetails.map((detail) => OrderDetails.fromJson(detail));
  }

  // Get order details by ID
  async getById(id: number): Promise<OrderDetails | null> {
    const orderDetails = await prisma.order_details.findUnique({
      where: { id },
    });

    return orderDetails ? OrderDetails.fromJson(orderDetails) : null;
  }

  // Update an existing order detail
  async update(orderDetails: OrderDetails): Promise<OrderDetails> {
    const updatedOrderDetails = await prisma.order_details.update({
      where: { id: orderDetails.id },
      data: {
        order_id: orderDetails.orderId,
        product_id: orderDetails.productId,
        quantity: orderDetails.quantity,
        seller_id: orderDetails.sellerId,
      },
    });

    return OrderDetails.fromJson(updatedOrderDetails);
  }

  // Delete order details by ID
  async delete(id: number): Promise<void> {
    await prisma.order_details.delete({
      where: { id },
    });
  }
}
