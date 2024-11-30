import { IOrderRepository } from "@/application/repositories/IOrderRepository";
import { Order } from "@/domain/entities/Order";
import { prisma } from "../database/prisma";
import { OrderDetails } from "@/domain/entities/OrderDetails";

export class OrderRepository implements IOrderRepository {
  constructor() {}

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
        // Create the order within the transaction
        const createdOrder = await prismaTransaction.orders.create({
          data: {
            buyer_id: order.buyerId,
            offer_id: order.offerId,
            status: order.status,
            total_amount: order.totalAmount,
          },
        });

        // Create associated order details within the transaction
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
        orderDetails: orderDetails.map((detail) => {
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
      console.error("Error during order transaction:", error);
      throw new Error("Failed to create order with details.");
    }
  }

  /**
 * Creates an order along with its associated order details in a single transaction.
 * Also updates product stock, quantity in seller inventory, and the buyer's wallet balance.
 *
 * @param {Order} order - The order entity to be created.
 * @param {OrderDetails[]} orderDetails - The list of order details to be associated with the order.
 * @returns {Promise<{ order: Order; orderDetails: OrderDetails[] }>} The created order and its details.
 */
async createOrderWithDetailsAndUpdateInventory(
  order: Order,
  orderDetails: OrderDetails[]
): Promise<{ order: Order; orderDetails: OrderDetails[] }> {
  try {
    // Perform the transaction
    const result = await prisma.$transaction(async (prismaTransaction) => {
      // Create the order within the transaction
      const createdOrder = await prismaTransaction.orders.create({
        data: {
          buyer_id: order.buyerId,
          offer_id: order.offerId,
          status: order.status,
          total_amount: order.totalAmount,
        },
      });

      // Create associated order details within the transaction
      await prismaTransaction.order_details.createMany({
        data: orderDetails.map((detail) => ({
          order_id: createdOrder.id,
          product_id: detail.productId,
          quantity: detail.quantity,
          seller_id: detail.sellerId,
        })),
      });

      // Update the stock in the product model
      for (const detail of orderDetails) {
        // Find the seller inventory entry first
        const sellerInventory = await prismaTransaction.seller_inventory.findFirst({
          where: {
            seller_id: detail.sellerId,
            product_id: detail.productId,
          },
        });

        if (!sellerInventory) {
          throw new Error(`Seller inventory not found for sellerId ${detail.sellerId} and productId ${detail.productId}`);
        }

        // Update the inventory using the unique identifier
        await prismaTransaction.seller_inventory.update({
          where: {
            id: sellerInventory.id,
          },
          data: {
            quantity: { decrement: detail.quantity },
            quantity_for_sale: { decrement: detail.quantity },
          },
        });

        // Update the product stock
        await prismaTransaction.product.update({
          where: {
            id: detail.productId,
          },
          data: {
            stock: { decrement: detail.quantity },
          },
        });
      }

      // Update buyer's wallet balance
      await prismaTransaction.wallet.update({
        where: {
          user_id: order.buyerId,
        },
        data: {
          // current_balance: { decrement: order.totalAmount ?? 0 },
        },
      });

      return { createdOrder };
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
      orderDetails: orderDetails.map((detail) => {
        return new OrderDetails(
          detail.id,
          result.createdOrder.id, // Associate with the created order ID
          detail.productId,
          detail.quantity,
          detail.sellerId
        );
      }),
    };
  } catch (error: any) {
      console.error("Error during order transaction:", error.message);
      throw new Error("Failed to create order with details.");
  }
  }
}
