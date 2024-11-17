import { Product } from "../../domain/entities/Product";

export interface IProductRepository {
    create(product: Product): Promise<Product>;
    update(product: Product): Promise<Product>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Product>;
    findAllProducts(): Promise<Product[]>;
    findBySellerId(sellerId: string): Promise<Product[]>;
    findByPrice(price: number): Promise<Product[]>;
    findByProductName(productName: string): Promise<Product[]>;
}