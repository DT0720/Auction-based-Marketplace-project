import { IOrderRepository } from "@/application/repositories/IOrderRepository";
import { Order } from "@/domain/entities/Order";
import { prisma } from "../database/prisma";
import { OrderDetails } from "@/domain/entities/OrderDetails";

/**
 * Repository for managing orders and related operations.
 * Provides methods to create, update, delete, and retrieve orders.
 */

export class OrderRepository implements IOrderRepository {
    constructor() { }

    /**
     * Creates a new order in the database.
     *
     * @param {Order} order - The order entity to be created.
     * @returns {Promise<Order>} The created order.
     * @throws {Error} If the creation fails.
     */

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

    /**
     * Retrieves an order by its ID.
     *
     * @param {number} id - The ID of the order to retrieve.
     * @returns {Promise<Order | null>} The order if found, otherwise `null`.
     */

    async getById(id: number): Promise<Order | null> {
        const order = await prisma.orders.findUnique({
            where: { id },
        });

        return order ? Order.fromJson(order) : null;
    }

    /**
     * Retrieves all orders for a specific buyer.
     *
     * @param {number} buyerId - The ID of the buyer.
     * @returns {Promise<Order[]>} A list of orders associated with the buyer.
     */

    async getByBuyerId(buyerId: number): Promise<Order[]> {
        const orders = await prisma.orders.findMany({
            where: { buyer_id: buyerId },
        });

        return orders.map((order) => Order.fromJson(order));
    }

    /**
     * Updates an existing order in the database.
     *
     * @param {Order} order - The updated order entity.
     * @returns {Promise<Order>} The updated order.
     * @throws {Error} If the update fails.
     */

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

    /**
     * Deletes an order by its ID.
     *
     * @param {number} id - The ID of the order to delete.
     * @returns {Promise<void>} Resolves when the order is deleted.
     */

    async delete(id: number): Promise<void> {
        await prisma.orders.delete({
            where: { id },
        });
    }

    /**
     * Creates an order along with its associated order details in a single transaction.
     *
     * @param {Order} order - The order entity to be created.
     * @param {OrderDetails[]} orderDetails - The list of order details to associate with the order.
     * @returns {Promise<{ order: Order; orderDetails: OrderDetails[] }>} The created order and its details.
     * @throws {Error} If the transaction fails.
     */

    async createOrderWithDetails(
        order: Order,
        orderDetails: OrderDetails[]
    ): Promise<{ order: Order; orderDetails: OrderDetails[] }> {
        try {
            const result = await prisma.$transaction(async (prismaTransaction) => {
                const createdOrder = await prismaTransaction.orders.create({
                    data: {
                        buyer_id: order.buyerId,
                        offer_id: order.offerId,
                        status: order.status,
                        total_amount: order.totalAmount,
                    },
                });

                const createdOrderDetails =
                    await prismaTransaction.order_details.createMany({
                        data: orderDetails.map((detail) => ({
                            order_id: createdOrder.id,
                            product_id: detail.productId,
                            quantity: detail.quantity,
                            seller_id: detail.sellerId,
                        })),
                    });

                return { createdOrder, createdOrderDetails };
            });

            return {
                order: new Order(
                    result.createdOrder.id,
                    result.createdOrder.buyer_id,
                    result.createdOrder.offer_id,
                    result.createdOrder.status,
                    result.createdOrder.total_amount
                        ? result.createdOrder.total_amount.toNumber()
                        : null // Convert Decimal to number
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
     * Updates product stock, seller inventory, and buyer's wallet balance.
     *
     * @param {Order} order - The order entity to be created.
     * @param {OrderDetails[]} orderDetails - The list of order details to associate with the order.
     * @param {number} user_id - The ID of the user (buyer) placing the order.
     * @returns {Promise<{ order: Order; orderDetails: OrderDetails[] }>} The created order and its details.
     * @throws {Error} If the transaction fails.
     */

    async createOrderWithDetailsAndUpdateInventory(
        order: Order,
        orderDetails: OrderDetails[],
        user_id: number
    ): Promise<{ order: Order; orderDetails: OrderDetails[] }> {
        try {
            const { createdOrder, createdOrderDetails } = await prisma.$transaction(
                async (prismaTransaction) => {
                    const createdOrder = await prismaTransaction.orders.create({
                        data: {
                            buyer_id: order.buyerId,
                            offer_id: order.offerId,
                            status: order.status,
                            total_amount: order.totalAmount,
                        },
                    });

                    await prismaTransaction.order_details.createMany({
                        data: orderDetails.map((detail) => ({
                            order_id: createdOrder.id,
                            product_id: detail.productId,
                            quantity: detail.quantity,
                            seller_id: detail.sellerId,
                        })),
                    });

                    const createdOrderDetails = orderDetails.map((detail) => {
                        return new OrderDetails(
                            0,
                            createdOrder.id,
                            detail.productId,
                            detail.quantity,
                            detail.sellerId
                        );
                    });

                    await prismaTransaction.wallet.update({
                        where: { user_id: user_id },
                        data: {
                            current_balance: { decrement: order.totalAmount ?? 0 },
                        },
                    });

                    return { createdOrder, createdOrderDetails };
                }
            );

            return {
                order: Order.fromJson(createdOrder),
                orderDetails: createdOrderDetails,
            };
        } catch (error: any) {
            console.error("Error during order transaction:", error.message);
            throw new Error("Failed to create order with details.");
        }
    }
}
