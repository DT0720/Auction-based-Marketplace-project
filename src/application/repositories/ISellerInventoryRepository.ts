import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { Product } from "../../domain/entities/Product";
import { SellerInventory } from "@/domain/entities/SellerInventory";

export interface ISellerInvertoryRepository {
    create(sellerInventory: SellerInventory): Promise<SellerInventory | null>;
    update(sellerInventory: SellerInventory): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    findAll(): Promise<Product[]>;
    findAllForSale(): Promise<Product[]>;
    findById(id: number): Promise<SellerInventory | null>;
    findBySellerId(sellerId: number): Promise<Product[]>;
    findByPrice(price: number): Promise<Product[]>;
    findByProductName(productName: string): Promise<Product[]>;
    findByProductId(productId: number): Promise<SellerInventory | null>;
    findByCategory(product_type : typeof ProductTypeEnum): Promise<Product[]>;
    getSellerIdsByProductIds(productIds: number[]): Promise<{ seller_id: number; product_id: number }[]>
}