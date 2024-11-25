import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { Product } from "../../domain/entities/Product";

export interface IProductRepository {
    create(product: Product): Promise<Product | null>;
    update(product: Product): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findById(id: number): Promise<Product | null>;
    findAllProducts(): Promise<Product[]>;
    findBySellerId(sellerId: string): Promise<Product[]>;
    findByPrice(price: number): Promise<Product[]>;
    findByProductName(productName: string): Promise<Product[]>;
    findByCategory(product_type : typeof ProductTypeEnum): Promise<Product[]>;
}