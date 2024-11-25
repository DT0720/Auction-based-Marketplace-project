import { ISellerInvertoryRepository } from "@/application/repositories/ISellerInventoryRepository";
import { Product } from "@/domain/entities/Product";
import { ProductTypeEnum, ProductTypeEnumKey } from "@/domain/enums/ProductTypeEnum";
import { prisma } from "../database/prisma";
import { SellerInventory } from "@/domain/entities/SellerInventory";

export class SellerInventoryRepository implements ISellerInvertoryRepository {

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
    update(product: Product): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<Product | null> {
        throw new Error("Method not implemented.");
    }
    findAllProducts(): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    findBySellerId(sellerId: string): Promise<Product[]> {
        throw new Error("Method not implemented.");
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