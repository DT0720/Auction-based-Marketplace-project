import { IOrderRepository } from "@/application/repositories/IOrderRepository";
import { Order } from "@/domain/entities/Order";
import { prisma } from "../database/prisma";
import { OrderDetails } from "@/domain/entities/OrderDetails";


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

  /**
   * Creates an order along with its associated order details in a single transaction.
   *
   * @param {Order} order - The order entity to be created.
   * @param {OrderDetails[]} orderDetails - The list of order details to be associated with the order.
   * @returns {Promise<{ order: Order; orderDetails: OrderDetails[] }>} The created order and its details.
   */
  async createOrderWithDetails(
    order: Order,
    orderDetails: OrderDetails[]
  ): Promise<{ order: Order; orderDetails: OrderDetails[] }> {
    try {
      // Perform the transaction
      const result = await prisma.$transaction(async (prismaTransaction) => {
        // Create the order
        const createdOrder = await prisma.orders.create({
          data: {
            buyer_id: order.buyerId,
            offer_id: order.offerId,
            status: order.status,
            total_amount: order.totalAmount,
          },
        });

        // Create associated order details
        const createdOrderDetails = await prismaTransaction.order_details.createMany({
          data: orderDetails.map((detail) => ({
            order_id: createdOrder.id,
            product_id: detail.productId,
            quantity: detail.quantity,
            seller_id: detail.sellerId,
          })),
        });

        return { createdOrder, createdOrderDetails };
      });

      // Map the created data back to domain entities
      return {
        order: new Order(
          result.createdOrder.id,
          result.createdOrder.buyer_id,
          result.createdOrder.offer_id,
          result.createdOrder.status,
          result.createdOrder.total_amount ? result.createdOrder.total_amount.toNumber() : null // Convert Decimal to number
        ),
        orderDetails: orderDetails.map((detail, index) => {
          return new OrderDetails(
            detail.id,
            result.createdOrder.id, // Associate with the created order ID
            detail.productId,
            detail.quantity,
            detail.sellerId
          );
        }),
      };
    } catch (error) {
      console.error('Error during order transaction:', error);
      throw new Error('Failed to create order with details.');
    }
  }
}
