import { IOrderRepository } from "@/application/repositories/IOrderRepository";
import { Order } from "@/domain/entities/Order";
import { OrderStatusEnum } from "@/domain/enums/OrderStatusEnum";
import { OrderRepository } from "@/infrastructure/repositories/OrderRepository";

/**
 * Unit tests for the `OrderRepository`.
 * This suite tests the functionality of the `OrderRepository` for creating and handling orders.
 */

describe("UserRepository", () => {
    let orderRepository: IOrderRepository;

    /**
     * Initializes the `OrderRepository` before each test.
     * Uses the global Prisma mock for database interactions.
     */

    beforeEach(() => {
        orderRepository = new OrderRepository(); // Uses the global prisma mock
    });

    /**
     * Test case for creating an order using the `OrderRepository`.
     * This test verifies that the `create` method in `OrderRepository` can create an order with valid input data.
     *
     * @example
     * // Example mock user data for creating an order
     * const mockUser = {
     *    buyer_id: 6,
     *    status: OrderStatusEnum.Pending,
     *    total_amount: 310.23
     * };
     *
     * @returns {Promise<void>} Logs the created order for debugging.
     */

    it("should create an order", async () => {
        // Arrange: Define mock data for the order creation
        const mockUser = {
            buyer_id: 6,
            status: OrderStatusEnum.Pending,
            total_amount: 310.23,
        };

        // Act: Call the create method in OrderRepository
        const products = await orderRepository.create(Order.fromJson(mockUser));

        // Debugging: Log the created order
        console.log("Test is: " + JSON.stringify(products));
    });
});
