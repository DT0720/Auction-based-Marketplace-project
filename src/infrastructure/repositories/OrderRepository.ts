import { IOrderRepository } from "@/application/repositories/IOrderRepository"; // Adjust import path based on your project structure
import { Orders } from "@/domain/entities/Order"; // Adjust import path based on your project structure
import { prisma } from "../database/prisma"; // Adjust import path based on your project structure
import { OrderStatusEnum } from "@/domain/enums/OrderStatusEnum"; // Adjust import path based on your project structure

export class OrderRepository implements IOrderRepository {
    update(order: Orders): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<Orders | null> {
        throw new Error("Method not implemented.");
    }
    findByBuyerId(buyerId: number): Promise<Orders[]> {
        throw new Error("Method not implemented.");
    }
    findBySellerId(sellerId: number): Promise<Orders[]> {
        throw new Error("Method not implemented.");
    }
    findAllOrders(): Promise<Orders[]> {
        throw new Error("Method not implemented.");
    }
    async create(order: Orders): Promise<Orders | null> {
        try {
            const createdOrder = await prisma.orders.create({
                data: {
                    buyer_id: order.buyer_id,
                    offer_id: order.offer_id,
                    status: OrderStatusEnum.Pending, // Set initial status as Pending
                    seller_id: order.seller_id,
                },
            });
            return Orders.fromJson(createdOrder); // Assuming you have a static method to create Order from JSON
        } catch (e: any) {
            console.error("Error creating order:", e);
            return null;
        }
    }

    async markAsReturned(orderId: number, reason?: string): Promise<boolean> {
        try {
            await prisma.orders.update({
                where: { id: orderId },
                data: {
                    status: OrderStatusEnum.Returned, // Set status to Returned using enum
                    // Optionally, you can add a reason field if needed in the future.
                },
            });
            return true;
        } catch (e) {
            console.error("Error marking order as returned:", e);
            return false;
        }
    }

    async markAsCanceled(orderId: number, reason?: string): Promise<boolean> {
        try {
            await prisma.orders.update({
                where: { id: orderId },
                data: {
                    status: OrderStatusEnum.Cancelled, // Set status to Cancelled using enum
                    // Optionally, you can add a reason field if needed in the future.
                },
            });
            return true;
        } catch (e) {
            console.error("Error marking order as canceled:", e);
            return false;
        }
    }

    async findReturnedOrders(): Promise<Orders[]> {
        try {
            const returnedOrders = await prisma.orders.findMany({
                where: { status: OrderStatusEnum.Returned }, // Fetch only returned orders
            });
            
            return returnedOrders.map(Orders.fromJson); // Convert each raw order to an Order instance
        } catch (e) {
            console.error("Error fetching all returned orders:", e);
            return [];
        }
    }

    async findCanceledOrders(): Promise<Orders[]> {
        try {
            const canceledOrders = await prisma.orders.findMany({
                where: { status: OrderStatusEnum.Cancelled }, // Fetch only canceled orders
            });
            
            return canceledOrders.map(Orders.fromJson); // Convert each raw order to an Order instance
        } catch (e) {
            console.error("Error fetching all canceled orders:", e);
            return [];
        }
    }
}
