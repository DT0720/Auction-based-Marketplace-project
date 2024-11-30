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
    async findByBuyerId(buyerId: number): Promise<Orders[]> {
        try {
          if (!buyerId) {
            throw new Error('Buyer ID is required');
          }
          console.log(" Buyer Id " + buyerId)
          // Fetch orders for the given buyer ID
          const orders = await prisma.orders.findMany({
            where: {
              buyer_id: buyerId,
            },
          });
          return orders.map((item) => Orders.fromJson(item));
        } catch (error: any) {
          console.error('Error fetching orders by buyer ID:', error);
          throw new Error('Failed to fetch orders for the specified buyer.');
        }
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