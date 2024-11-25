import { ISellerInvertoryRepository } from "@/application/repositories/ISellerInventoryRepository";
import { Product } from "@/domain/entities/Product";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { prisma } from "../database/prisma";
import { SellerInventory } from "@/domain/entities/SellerInventory";
import { IProductRepository } from "@/application/repositories/IProductRepository";
import { ProductRepository } from "./ProductRepository";

export class SellerInventoryRepository implements ISellerInvertoryRepository {

    private productRepository : IProductRepository = new ProductRepository();

    async create(sellerInventory: SellerInventory): Promise<SellerInventory | null> {
        try {
            const inventory = await prisma.seller_inventory.create({
                data: sellerInventory.toJson(),
            });
            return SellerInventory.fromJson(inventory);
        } catch (e) {
            console.error("Error creating product:", e);
            return null;
        }
    }
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
    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
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

    async findByProductId(productId: number): Promise<SellerInventory | null> {
        try {
            const inventory = await prisma.seller_inventory.findFirst({
                where: {
                    product_id: productId
                },
            });
            return inventory ? SellerInventory.fromJson(inventory) : null;
        } catch (error) {
            console.error("Error finding seller inventory by product ID:", error);
            return null;
        }
    }

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
            console.error("Error fetching all products:", e);
            return [];
        }
    }

    async findAllForSale(): Promise<Product[]> {
        try {
            const result = await prisma.seller_inventory.findMany({
                where: {
                    quantity_for_sale: {
                        gt: 0
                    }
                },
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

    async findBySellerId(sellerId: number): Promise<Product[]> {
        try {
            const result = await prisma.seller_inventory.findMany({
                where: {
                    seller_id: sellerId,
                },
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
    findByPrice(price: number): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    findByProductName(productName: string): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    findByCategory(product_type: typeof ProductTypeEnum): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

}