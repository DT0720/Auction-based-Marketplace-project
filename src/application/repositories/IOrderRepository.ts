import { Order } from "@/domain/entities/Order";
import { OrderDetails } from "@/domain/entities/OrderDetails";

/**
 * Interface for Order Repository to handle order-related operations.
 */
export interface IOrderRepository {
    /**
     * Creates a new order in the system.
     *
     * @param {Order} order - The order entity to be created.
     * @returns {Promise<Order>} - A promise that resolves to the created order.
     */

    create(order: Order): Promise<Order>;

    /**
     * Retrieves an order by its unique ID.
     *
     * @param {number} id - The unique ID of the order.
     * @returns {Promise<Order | null>} - A promise that resolves to the order if found, or `null` if not found.
     */

    getById(id: number): Promise<Order | null>;

    /**
     * Retrieves all orders associated with a specific buyer.
     *
     * @param {number} buyerId - The unique ID of the buyer.
     * @returns {Promise<Order[]>} - A promise that resolves to an array of orders for the specified buyer.
     */

    getByBuyerId(buyerId: number): Promise<Order[]>;

    /**
     * Updates an existing order in the system.
     *
     * @param {Order} order - The order entity with updated details.
     * @returns {Promise<Order>} - A promise that resolves to the updated order.
     */

    update(order: Order): Promise<Order>;

    /**
     * Deletes an order from the system by its unique ID.
     *
     * @param {number} id - The unique ID of the order to be deleted.
     * @returns {Promise<void>} - A promise that resolves when the order is deleted.
     */

    delete(id: number): Promise<void>;

    /**
     * Creates an order along with its details and updates the inventory for the associated products.
     *
     * @param {Order} order - The main order entity to be created.
     * @param {OrderDetails[]} orderDetails - The list of order details associated with the order.
     * @param {number} user_id - The ID of the user placing the order.
     * @returns {Promise<{ order: Order; orderDetails: OrderDetails[] }>} - A promise that resolves to the created order
     * and its associated order details.
     */

    createOrderWithDetailsAndUpdateInventory(
        order: Order,
        orderDetails: OrderDetails[],
        user_id: number
    ): Promise<{ order: Order; orderDetails: OrderDetails[] }>;
}
