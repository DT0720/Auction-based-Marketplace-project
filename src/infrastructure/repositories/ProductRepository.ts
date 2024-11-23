/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProductRepository } from "@/application/repositories/IProductRepository";
import { Product } from "@/domain/entities/Product";
import { prisma } from "../database/prisma";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";

export class ProductRepository implements IProductRepository{
    create(product: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    update(product: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    async findAllProducts(): Promise<Product[]> {
        try{
            const products = await prisma.product.findMany(); // Fetch all products from the database
            return products.map(product => new Product(
                product.id,
                product.product_name,
                product.stock,
                parseFloat(product.price_per_unit.toString()), // Convert Decimal to number,
                product.category ?? "No Category",
                product.photo // Handle photo if needed
            ));

        }catch(e:any){
            console.log(e.trace());
            return [];
        }
    }
    findBySellerId(sellerId: string): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    findByCategory(product_type: ProductTypeEnum): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    findByPrice(price: number): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    findByProductName(productName: string): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    
}