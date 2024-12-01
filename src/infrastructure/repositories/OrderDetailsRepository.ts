import { IOrderDetailsRepository } from "@/application/repositories/IOrderDetailsRepository";
import { OrderDetails } from "@/domain/entities/OrderDetails";
import { prisma } from "../database/prisma";

/**
 * Repository for managing order details.
 * Provides methods to create, update, delete, and retrieve order details.
 */

export class OrderDetailsRepository implements IOrderDetailsRepository {
    constructor() { }

    /**
     * Creates a new order detail in the database.
     *
     * @param {OrderDetails} orderDetails - The order detail entity to be created.
     * @returns {Promise<OrderDetails>} The created order detail.
     * @throws {Error} If the creation fails.
     */

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

    /**
     * Retrieves all order details associated with a specific order.
     *
     * @param {number} orderId - The ID of the order.
     * @returns {Promise<OrderDetails[]>} A list of order details for the specified order.
     */

    async getByOrderId(orderId: number): Promise<OrderDetails[]> {
        const orderDetails = await prisma.order_details.findMany({
            where: { order_id: orderId },
        });

        return orderDetails.map((detail) => OrderDetails.fromJson(detail));
    }

    /**
     * Retrieves an order detail by its ID.
     *
     * @param {number} id - The ID of the order detail to retrieve.
     * @returns {Promise<OrderDetails | null>} The order detail if found, otherwise `null`.
     */

    async getById(id: number): Promise<OrderDetails | null> {
        const orderDetails = await prisma.order_details.findUnique({
            where: { id },
        });

        return orderDetails ? OrderDetails.fromJson(orderDetails) : null;
    }

    /**
     * Updates an existing order detail in the database.
     *
     * @param {OrderDetails} orderDetails - The updated order detail entity.
     * @returns {Promise<OrderDetails>} The updated order detail.
     * @throws {Error} If the update fails.
     */

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

    /**
     * Deletes an order detail by its ID.
     *
     * @param {number} id - The ID of the order detail to delete.
     * @returns {Promise<void>} Resolves when the order detail is deleted.
     * @throws {Error} If the deletion fails.
     */

    async delete(id: number): Promise<void> {
        await prisma.order_details.delete({
            where: { id },
        });
    }
}
