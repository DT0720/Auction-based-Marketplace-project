/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProductRepository } from "@/application/repositories/IProductRepository";
import { Product } from "@/domain/entities/Product";
import { prisma } from "../database/prisma";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";

export class ProductRepository implements IProductRepository{


/**
 * Creates a new product in the database.
 * 
 * This method attempts to insert a new product into the database using Prisma. If successful,
 * it returns the created `Product` object. In case of an error, it logs the error and returns `null`.
 *
 * @param {Product} product - The product instance to be created. The product's data is extracted
 *                              using the `toJson()` method for database insertion.
 * @returns {Promise<Product | null>} A promise that resolves to the created `Product` object
 *                                     if the creation is successful, or `null` if there is an error.
 *
 * @throws {Error} If there is an issue with the database query, an error is caught and logged.
 */    
    async create(product: Product): Promise<Product | null> {
        try {
            const newProduct = await prisma.product.create({
                data: product.toJson(),
            });
            return Product.fromJson(newProduct);
        } catch (e) {
            console.error("Error creating product:", e);
            return null;
        }
        
    }

    async createBySellerId(product: Product, sellerId: string): Promise<Product | null> {
        try {
            const newProduct = await prisma.product.create({
                data: product.toJson(),
            });
            return Product.fromJson(newProduct);
        } catch (e) {
            console.error("Error creating product:", e);
            return null;
        }
    } 

    async update(_product: Product): Promise<boolean> {
        try {
            // Filter out undefined, null, and excluded keys
            const dataToUpdate = Object.fromEntries(
                Object.entries(_product).filter(([key, value]) => 
                    value !== undefined && value !== null && key !== 'id' && value !== ''
                )
            );

            console.log(`Data to update: ${JSON.stringify(dataToUpdate)}`);
            // Determine where clause
            const whereClause = _product.id ? { 
                id: _product.id 
            } : null;
    
            // Validate inputs
            if (!whereClause) {
                console.error("Error: Missing product id for update.");
                return false;
            }
    
            if (Object.keys(dataToUpdate).length === 0) {
                console.error("Error: No fields to update.");
                return false;
            }
    
            await prisma.product.update({
                where: whereClause,
                data: dataToUpdate,
            });
    
            return true;  // Indicate success
        } catch (e) {
            console.error("Error updating product:", e);
            return false;  // Indicate failure
        }
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

    async findByCategory(categoryKey: keyof typeof ProductTypeEnum): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany({
                where: {
                    category: {
                        equals: categoryKey, // Enforces exact match
                    },
                },
            });
            return products.map(product => Product.fromJson(product));
        } catch (e: any) {
            console.log(e.message);
            return [];
        }
    }
    
    async findByPrice(price: number): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany({
                where: {
                    price_per_unit: price, // Exact price match
                },
            });
            return products.map(product => Product.fromJson(product));
        } catch (e: any) {
            console.log(e.message);
            return [];
        }
    }
    
    async findByProductName(productName: string): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany({
                where: {
                    product_name: {
                        contains: productName.toLowerCase(), // Convert input to lowercase
                    },  
                },
            });
            return products.map(product => Product.fromJson(product));
        } catch (e: any) {
            console.log(e.message);
            return [];
        }
    }
    

}