import { OrderRepository } from "@/infrastructure/repositories/OrderRepository";
import { prisma } from "@/infrastructure/database/prisma";
import { Order } from "@/domain/entities/Order";
import { OrderDetails } from "@/domain/entities/OrderDetails";

jest.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    orders: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    order_details: {
      createMany: jest.fn(),
    },
    wallet: {
      update: jest.fn(),
    },
    $transaction: jest.fn((callback: any) => callback(prisma)),
  },
}));

describe("OrderRepository", () => {
  let orderRepository: OrderRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    orderRepository = new OrderRepository();
  });

  describe("create", () => {
    it("should create a new order", async () => {
      const mockOrder = {
        buyerId: 1,
        offerId: 2,
        status: "PENDING",
        totalAmount: 100,
      };
      const mockCreatedOrder = { ...mockOrder, id: 1 };

      (prisma.orders.create as jest.Mock).mockResolvedValue(mockCreatedOrder);

      const order = new Order(0, 1, 2, "PENDING", 100);
      const result = await orderRepository.create(order);

      expect(prisma.orders.create).toHaveBeenCalledWith({
        data: {
          buyer_id: order.buyerId,
          offer_id: order.offerId,
          status: order.status,
          total_amount: order.totalAmount,
        },
      });
      expect(result).toEqual(Order.fromJson(mockCreatedOrder));
    });
  });

  describe("getById", () => {
    it("should retrieve an order by ID", async () => {
      const mockOrder = { id: 1, buyer_id: 1, offer_id: 2, status: "PENDING", total_amount: 100 };

      (prisma.orders.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderRepository.getById(1);

      expect(prisma.orders.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(Order.fromJson(mockOrder));
    });

    it("should return null if order not found", async () => {
      (prisma.orders.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await orderRepository.getById(999);

      expect(prisma.orders.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });

  describe("getByBuyerId", () => {
    it("should retrieve all orders for a buyer", async () => {
      const mockOrders = [
        { id: 1, buyer_id: 1, offer_id: 2, status: "PENDING", total_amount: 100 },
        { id: 2, buyer_id: 1, offer_id: 3, status: "COMPLETED", total_amount: 200 },
      ];

      (prisma.orders.findMany as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderRepository.getByBuyerId(1);

      expect(prisma.orders.findMany).toHaveBeenCalledWith({ where: { buyer_id: 1 } });
      expect(result).toEqual(mockOrders.map(Order.fromJson));
    });
  });

  describe("update", () => {
    it("should update an existing order", async () => {
      const mockOrder = {
        id: 1,
        buyerId: 1,
        offerId: 2,
        status: "COMPLETED",
        totalAmount: 150,
      };
      const updatedOrder = { ...mockOrder, total_amount: 150 };

      (prisma.orders.update as jest.Mock).mockResolvedValue(updatedOrder);

      const order = new Order(1, 1, 2, "COMPLETED", 150);
      const result = await orderRepository.update(order);

      expect(prisma.orders.update).toHaveBeenCalledWith({
        where: { id: order.id },
        data: {
          buyer_id: order.buyerId,
          offer_id: order.offerId,
          status: order.status,
          total_amount: order.totalAmount,
        },
      });
      expect(result).toEqual(Order.fromJson(updatedOrder));
    });
  });

  describe("delete", () => {
    it("should delete an order by ID", async () => {
      (prisma.orders.delete as jest.Mock).mockResolvedValue(undefined);

      await orderRepository.delete(1);

      expect(prisma.orders.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("createOrderWithDetails", () => {
    it("should create an order with details in a transaction", async () => {
      const mockOrder = {
        buyerId: 1,
        offerId: 2,
        status: "PENDING",
        totalAmount: 100,
      };
      const mockOrderDetails = [
        { productId: 1, quantity: 2, sellerId: 3 },
        { productId: 2, quantity: 1, sellerId: 4 },
      ];

      const createdOrder = { id: 1, ...mockOrder };
      const createdOrderDetails = mockOrderDetails.map((detail, index) => ({
        id: index + 1,
        order_id: 1,
        ...detail,
      }));

      (prisma.orders.create as jest.Mock).mockResolvedValue(createdOrder);
      (prisma.order_details.createMany as jest.Mock).mockResolvedValue({ count: 2 });

      const result = await orderRepository.createOrderWithDetails(
        new Order(0, 1, 2, "PENDING", 100),
        mockOrderDetails.map((detail) => new OrderDetails(0, 0, detail.productId, detail.quantity, detail.sellerId))
      );

      expect(prisma.orders.create).toHaveBeenCalled();
      expect(prisma.order_details.createMany).toHaveBeenCalled();
      expect(result.order).toEqual(Order.fromJson(createdOrder));
      expect(result.orderDetails.length).toBe(2);
    });
  });
});
