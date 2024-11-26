import { Orders } from "@/domain/entities/Order"; // Adjust the import path based on your project structure

export interface IOrderRepository {
    create(order: Orders): Promise<Orders | null>; // Create a new order
    update(order: Orders): Promise<boolean>; // Update an existing order
    delete(id: number): Promise<boolean>; // Delete an order by ID
    findById(id: number): Promise<Orders | null>; // Find an order by ID
    findByBuyerId(buyerId: number): Promise<Orders[]>; // Find orders by buyer ID
    findBySellerId(sellerId: number): Promise<Orders[]>; // Find orders by seller ID
    findAllOrders(): Promise<Orders[]>; // Find all orders
    findCanceledOrders(): Promise<Orders[]>;
    findReturnedOrders(): Promise<Orders[]>
}