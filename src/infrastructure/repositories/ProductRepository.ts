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
    async findById(product_id: number): Promise<Product | null> {

        console.log(`Product ID findById: ${product_id}`);

        const product = await prisma.product.findUnique({
            where: {
              id: product_id,  // 'id' is assumed to be the primary key of the 'Product' table
            },
        });

        return Product.fromJson(product);
    }
    async findAllProducts(): Promise<Product[]> {
        try{
            const products = await prisma.product.findMany(); // Fetch all products from the database
            return products.map(product => Product.fromJson(product)
        );
        }catch(e:any){
            console.log(e.message);
            return [];
        }
    }
    findBySellerId(sellerId: string): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    findByCategory(product_type: typeof ProductTypeEnum): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    findByPrice(price: number): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    findByProductName(productName: string): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    
}