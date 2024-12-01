import { OrderDetails } from "@/domain/entities/OrderDetails";

/**
 * Interface for Order Details Repository to handle order details-related operations.
 */

export interface IOrderDetailsRepository {
    /**
     * Creates a new order details record in the system.
     *
     * @param {OrderDetails} orderDetails - The order details entity to be created.
     * @returns {Promise<OrderDetails>} - A promise that resolves to the created order details.
     */

    create(orderDetails: OrderDetails): Promise<OrderDetails>;

    /**
     * Retrieves all order details associated with a specific order ID.
     *
     * @param {number} orderId - The unique ID of the order.
     * @returns {Promise<OrderDetails[]>} - A promise that resolves to an array of order details for the specified order.
     */

    getByOrderId(orderId: number): Promise<OrderDetails[]>;

    /**
     * Retrieves an order details record by its unique ID.
     *
     * @param {number} id - The unique ID of the order details record.
     * @returns {Promise<OrderDetails | null>} - A promise that resolves to the order details record if found, or `null` if not found.
     */

    getById(id: number): Promise<OrderDetails | null>;

    /**
     * Updates an existing order details record in the system.
     *
     * @param {OrderDetails} orderDetails - The order details entity with updated information.
     * @returns {Promise<OrderDetails>} - A promise that resolves to the updated order details.
     */

    update(orderDetails: OrderDetails): Promise<OrderDetails>;

    /**
     * Deletes an order details record from the system by its unique ID.
     *
     * @param {number} id - The unique ID of the order details record to be deleted.
     * @returns {Promise<void>} - A promise that resolves when the order details record is deleted.
     */

    delete(id: number): Promise<void>;
}
