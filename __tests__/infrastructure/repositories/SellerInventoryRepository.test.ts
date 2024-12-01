import { SellerInventoryRepository } from "@/infrastructure/repositories/SellerInventoryRepository";
import { prisma } from "@/infrastructure/database/prisma";
import { ProductRepository } from "@/infrastructure/repositories/ProductRepository";
import { SellerInventory } from "@/domain/entities/SellerInventory";
import { Product } from "@/domain/entities/Product";

jest.mock("@/infrastructure/database/prisma", () => ({
  prisma: {
    seller_inventory: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/infrastructure/repositories/ProductRepository", () => ({
  ProductRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
  })),
}));

describe("SellerInventoryRepository", () => {
  let sellerInventoryRepository: SellerInventoryRepository;
  let mockProductRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockProductRepository = new ProductRepository();
    sellerInventoryRepository = new SellerInventoryRepository();
    // Override the injected product repository with the mock
    (sellerInventoryRepository as any).productRepository = mockProductRepository;
  });

  describe("create", () => {
    it("should create a seller inventory entry", async () => {
      const mockInventory = {
        id: 1,
        seller_id: 1,
        product_id: 1,
        quantity_for_sale: 10,
      };

      (prisma.seller_inventory.create as jest.Mock).mockResolvedValue(mockInventory);

      const inventoryEntity = SellerInventory.fromJson(mockInventory);
      const result = await sellerInventoryRepository.create(inventoryEntity);

      expect(prisma.seller_inventory.create).toHaveBeenCalledWith({
        data: inventoryEntity.toJson(),
      });
      expect(result).toEqual(SellerInventory.fromJson(mockInventory));
    });

    it("should return null if creation fails", async () => {
      (prisma.seller_inventory.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      const inventoryEntity = new SellerInventory(-1, 1, 1, 10, 1);
      const result = await sellerInventoryRepository.create(inventoryEntity);

      expect(prisma.seller_inventory.create).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a seller inventory entry", async () => {
      const mockInventory = {
        id: 1,
        seller_id: 1,
        product_id: 1,
        quantity_for_sale: 20,
      };

      (prisma.seller_inventory.update as jest.Mock).mockResolvedValue(mockInventory);

      const inventoryEntity = SellerInventory.fromJson(mockInventory);
      const result = await sellerInventoryRepository.update(inventoryEntity);

      expect(prisma.seller_inventory.update).toHaveBeenCalledWith({
        where: { id: inventoryEntity.id },
        data: inventoryEntity.toJson(),
      });
      expect(result).toBe(true);
    });

    it("should return false if update fails", async () => {
      (prisma.seller_inventory.update as jest.Mock).mockRejectedValue(new Error("Database error"));

      const inventoryEntity = new SellerInventory(-1, 1, 1, 10, 1);
      const result = await sellerInventoryRepository.update(inventoryEntity);

      expect(prisma.seller_inventory.update).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe("delete", () => {
    it("should delete a seller inventory entry by ID", async () => {
      (prisma.seller_inventory.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await sellerInventoryRepository.delete(1);

      expect(prisma.seller_inventory.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(true);
    });

    it("should return false if deletion fails", async () => {
      (prisma.seller_inventory.delete as jest.Mock).mockRejectedValue(new Error("Database error"));

      const result = await sellerInventoryRepository.delete(1);

      expect(prisma.seller_inventory.delete).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe("findById", () => {
    it("should find a seller inventory entry by ID", async () => {
      const mockInventory = {
        id: 1,
        seller_id: 1,
        product_id: 1,
        quantity_for_sale: 10,
      };

      (prisma.seller_inventory.findUnique as jest.Mock).mockResolvedValue(mockInventory);

      const result = await sellerInventoryRepository.findById(1);

      expect(prisma.seller_inventory.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(SellerInventory.fromJson(mockInventory));
    });

    it("should return null if inventory is not found", async () => {
      (prisma.seller_inventory.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await sellerInventoryRepository.findById(1);

      expect(prisma.seller_inventory.findUnique).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("findByProductId", () => {
    it("should find a seller inventory entry by product ID", async () => {
      const mockInventory = {
        id: 1,
        seller_id: 1,
        product_id: 1,
        quantity_for_sale: 10,
      };

      (prisma.seller_inventory.findFirst as jest.Mock).mockResolvedValue(mockInventory);

      const result = await sellerInventoryRepository.findByProductId(1);

      expect(prisma.seller_inventory.findFirst).toHaveBeenCalledWith({ where: { product_id: 1 } });
      expect(result).toEqual(SellerInventory.fromJson(mockInventory));
    });
  });

  describe("findAll", () => {
    it("should find all seller inventory entries and map to products", async () => {
      const mockInventory = [
        { id: 1, seller_id: 1, product_id: 1, quantity_for_sale: 10 },
        { id: 2, seller_id: 2, product_id: 2, quantity_for_sale: 5 },
      ];

      const mockProducts = [
        new Product(1, "Product 1", 100, 100,"Description 1", null, null),
        new Product(2, "Product 2", 200, 150,"Description 2", null, null),
      ];

      (prisma.seller_inventory.findMany as jest.Mock).mockResolvedValue(mockInventory);
      mockProductRepository.findById
        .mockResolvedValueOnce(mockProducts[0])
        .mockResolvedValueOnce(mockProducts[1]);

      const result = await sellerInventoryRepository.findAll();

      expect(prisma.seller_inventory.findMany).toHaveBeenCalled();
      expect(mockProductRepository.findById).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockProducts);
    });

    it("should return an empty array if no inventory is found", async () => {
      (prisma.seller_inventory.findMany as jest.Mock).mockResolvedValue([]);

      const result = await sellerInventoryRepository.findAll();

      expect(prisma.seller_inventory.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("getSellerIdsByProductIds", () => {
    it("should retrieve seller IDs associated with product IDs", async () => {
      const mockSellers = [
        { seller_id: 1, product_id: 1 },
        { seller_id: 2, product_id: 2 },
      ];

      (prisma.seller_inventory.findMany as jest.Mock).mockResolvedValue(mockSellers);

      const result = await sellerInventoryRepository.getSellerIdsByProductIds([1, 2]);

      expect(prisma.seller_inventory.findMany).toHaveBeenCalledWith({
        where: { product_id: { in: [1, 2] } },
        select: { seller_id: true, product_id: true },
      });
      expect(result).toEqual(mockSellers);
    });
  });
});
