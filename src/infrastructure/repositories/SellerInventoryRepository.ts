import { ISellerInvertoryRepository } from "@/application/repositories/ISellerInventoryRepository";
import { Product } from "@/domain/entities/Product";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { prisma } from "../database/prisma";
import { SellerInventory } from "@/domain/entities/SellerInventory";
import { IProductRepository } from "@/application/repositories/IProductRepository";
import { ProductRepository } from "./ProductRepository";

export class SellerInventoryRepository implements ISellerInvertoryRepository {
  private productRepository: IProductRepository = new ProductRepository();

  // Create a new seller inventory
  async create(sellerInventory: SellerInventory): Promise<SellerInventory | null> {
    try {
      const inventory = await prisma.seller_inventory.create({
        data: sellerInventory.toJson(),
      });
      return SellerInventory.fromJson(inventory);
    } catch (e) {
      console.error("Error creating seller inventory:", e);
      return null;
    }
  }

  // Update an existing seller inventory
  async update(sellerInventory: SellerInventory): Promise<boolean> {
    try {
      await prisma.seller_inventory.update({
        where: { id: sellerInventory.id },
        data: sellerInventory.toJson(),
      });
      return true;
    } catch (error) {
      console.error("Error updating seller inventory:", error);
      return false;
    }
  }

  // Delete a seller inventory entry by its ID
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.seller_inventory.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting seller inventory:", error);
      return false;
    }
  }

  // Find a seller inventory by ID
  async findById(id: number): Promise<SellerInventory | null> {
    try {
      const inventory = await prisma.seller_inventory.findUnique({
        where: { id },
      });
      return inventory ? SellerInventory.fromJson(inventory) : null;
    } catch (error) {
      console.error("Error finding seller inventory by ID:", error);
      return null;
    }
  }

  // Find seller inventory by product ID
  async findByProductId(productId: number): Promise<SellerInventory | null> {
    try {
      const inventory = await prisma.seller_inventory.findFirst({
        where: { product_id: productId },
      });
      return inventory ? SellerInventory.fromJson(inventory) : null;
    } catch (error) {
      console.error("Error finding seller inventory by product ID:", error);
      return null;
    }
  }

  // Find all seller inventory records
  async findAll(): Promise<Product[]> {
    try {
      const result = await prisma.seller_inventory.findMany();
            // Use Promise.all to await all async calls and filter out null results
      const products = await Promise.all(
        result.map(async (seller_inventory) => {
          const product = await this.productRepository.findById(seller_inventory.product_id);
          return product ? product : null;
        })
      );
            // Filter out null values from the products array
      return products.filter((product): product is Product => product !== null);
    } catch (e) {
      console.error("Error fetching all seller inventory:", e);
      return [];
    }
  }

  // Find all seller inventory records that are for sale
  async findAllForSale(): Promise<Product[]> {
    try {
      const result = await prisma.seller_inventory.findMany({
        where: { quantity_for_sale: { gt: 0 } },
      });
      // Use Promise.all to await all async calls and filter out null results
      const products = await Promise.all(
        result.map(async (seller_inventory) => {
          const product = await this.productRepository.findById(seller_inventory.product_id);
          return product ? product : null;
        })
      );
      // Filter out null values from the products array
      return products.filter((product): product is Product => product !== null);
    } catch (e) {
      console.error("Error fetching products for sale:", e);
      return [];
    }
  }

  // Find seller inventory by seller ID
  async findBySellerId(sellerId: number): Promise<Product[]> {
    try {
      const result = await prisma.seller_inventory.findMany({
        where: { seller_id: sellerId },
      });
    
      // Use Promise.all to await all async calls and filter out null results
      const products = await Promise.all(
        result.map(async (seller_inventory) => {
          const product = await this.productRepository.findById(seller_inventory.product_id);
          return product ? product : null;
        })
      );
      // Filter out null values from the products array
      return products.filter((product): product is Product => product !== null);
    } catch (e) {
      console.error("Error fetching products by seller id:", e);
      return [];
    }
  }

  // Find seller inventory by price (This is a placeholder for future implementation)
  async findByPrice(price: number): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  // Find seller inventory by product name (This is a placeholder for future implementation)
  async findByProductName(productName: string): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  // Find seller inventory by category (This is a placeholder for future implementation)
  async findByCategory(product_type: typeof ProductTypeEnum): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  // Get seller IDs by product IDs (This method fetches all sellers for given products)
  async getSellerIdsByProductIds(productIds: number[]): Promise<{ seller_id: number; product_id: number }[]> {
    try {
      const sellers = await prisma.seller_inventory.findMany({
        where: {
          product_id: { in: productIds }, // Filters seller_inventory records by product IDs
        },
        select: {
          seller_id: true, // Select the seller_id field
          product_id: true, // Select the product_id field
        },
      });

      // Return the array of objects containing seller_id and product_id
      return sellers.map(seller => ({
        seller_id: seller.seller_id,
        product_id: seller.product_id,
      }));
    } catch (error) {
      console.error("Error fetching seller IDs by product IDs:", error);
      return [];
    }
  }
}