import { ProductRepository } from "@/infrastructure/repositories/ProductRepository";
import { prisma } from "@/infrastructure/database/prisma";
import { Product } from "@/domain/entities/Product";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";

jest.mock("@/infrastructure/database/prisma", () => ({
  prisma: {
    product: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("ProductRepository", () => {
  let productRepository: ProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    productRepository = new ProductRepository();
  });

  describe("create", () => {
    it("should create a new product", async () => {
      const mockProduct = {
        id: 1,
        product_name: "Laptop",
        price_per_unit: 1000,
      };
      const productEntity = Product.fromJson(mockProduct);

      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.create(productEntity);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: productEntity.toJson(),
      });
      expect(result).toEqual(Product.fromJson(mockProduct));
    });

    it("should return null if creation fails", async () => {
      (prisma.product.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      const productEntity = new Product(-1, "Phone", 500, 1000, ProductTypeEnum.ELECTRONICE_DEVICES, "New phone", null);
      const result = await productRepository.create(productEntity);

      expect(prisma.product.create).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("createBySellerId", () => {
    it("should create a product associated with a seller", async () => {
      const mockProduct = {
        id: 1,
        product_name: "Phone",
        price_per_unit: 500,
      };
      const productEntity = Product.fromJson(mockProduct);

      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.createBySellerId(productEntity, "seller123");

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: productEntity.toJson(),
      });
      expect(result).toEqual(Product.fromJson(mockProduct));
    });
  });

  describe("update", () => {
    it("should update an existing product", async () => {
      const mockProduct = {
        id: 1,
        product_name: "Updated Laptop",
        price_per_unit: 1200,
      };

      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const productEntity = Product.fromJson(mockProduct);
      const result = await productRepository.update(productEntity);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productEntity.id },
        data: productEntity.toJson(),
      });
      expect(result).toBe(true);
    });

    it("should return false if update fails", async () => {
      (prisma.product.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

      const productEntity = new Product(-1, "Phone", 500, 1000, ProductTypeEnum.ELECTRONICE_DEVICES, "New phone", null);
      const result = await productRepository.update(productEntity);

      expect(prisma.product.update).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe("delete", () => {
    it("should delete a product by ID", async () => {
      (prisma.product.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await productRepository.delete("123");

      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: "123" } });
      expect(result).toBe(true);
    });

    it("should return false if deletion fails", async () => {
      (prisma.product.delete as jest.Mock).mockRejectedValue(new Error("Delete failed"));

      const result = await productRepository.delete("123");

      expect(prisma.product.delete).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe("findById", () => {
    it("should find a product by ID", async () => {
      const mockProduct = {
        id: 1,
        product_name: "Laptop",
        price_per_unit: 1000,
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.findById(1);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(Product.fromJson(mockProduct));
    });

    it("should return null if product is not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await productRepository.findById(1);

      expect(prisma.product.findUnique).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("findAllProducts", () => {
    it("should retrieve all products", async () => {
      const mockProducts = [
        { id: 1, product_name: "Laptop", price_per_unit: 1000 },
        { id: 2, product_name: "Phone", price_per_unit: 500 },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productRepository.findAllProducts();

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockProducts.map(Product.fromJson));
    });
  });

  describe("findByCategory", () => {
    it("should retrieve products by category", async () => {
      const mockProducts = [
        { id: 1, product_name: "Laptop", price_per_unit: 1000, category: ProductTypeEnum.ELECTRONICE_DEVICES },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productRepository.findByCategory(ProductTypeEnum.ELECTRONICE_DEVICES as keyof typeof ProductTypeEnum);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { category: { equals: ProductTypeEnum.ELECTRONICE_DEVICES } },
      });
      expect(result).toEqual(mockProducts.map(Product.fromJson));
    });
  });

  describe("findByPrice", () => {
    it("should retrieve products by price", async () => {
      const mockProducts = [
        { id: 1, product_name: "Laptop", price_per_unit: 1000 },
        { id: 2, product_name: "Phone", price_per_unit: 1000 },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productRepository.findByPrice(1000);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { price_per_unit: 1000 },
      });
      expect(result).toEqual(mockProducts.map(Product.fromJson));
    });
  });

  describe("findByProductName", () => {
    it("should retrieve products containing a specific name", async () => {
      const mockProducts = [
        { id: 1, product_name: "Laptop", price_per_unit: 1000 },
        { id: 2, product_name: "Gaming Laptop", price_per_unit: 1500 },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productRepository.findByProductName("laptop");

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { product_name: { contains: "laptop".toLowerCase() } },
      });
      expect(result).toEqual(mockProducts.map(Product.fromJson));
    });
  });
});
