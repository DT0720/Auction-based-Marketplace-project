import { IProductRepository } from "@/application/repositories/IProductRepository";
import { Product } from "@/domain/entities/Product";
import { prisma } from "../database/prisma";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";

export class ProductRepository implements IProductRepository{


/**
 * Creates a new product in the database.
 *
 * @async
 * @function create
 * @param {Product} product - The product instance to be created. The `Product` object should have a `toJson` method to convert it into a plain object.
 * @returns {Promise<Product | null>} A promise that resolves to a `Product` instance created from the database, or `null` if an error occurs.
 *
 * @description This function uses Prisma to insert a new product record into the database. 
 * It takes a `Product` object as input, converts it to JSON format using the `toJson` method,
 * and then uses the Prisma `create` function to save it to the database. If the operation is 
 * successful, the created product is returned as a `Product` instance by calling the `fromJson` method. 
 * If an error occurs, it logs the error and returns `null`.
 *
 * @example
 * const newProduct = new Product({ name: 'Laptop', price: 1000 });
 * const createdProduct = await create(newProduct);
 * if (createdProduct) {
 *     console.log('Product created:', createdProduct);
 * } else {
 *     console.error('Failed to create product');
 * }
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

/**
 * Creates a new product in the database and associates it with a seller ID.
 *
 * @async
 * @function createBySellerId
 * @param {Product} product - The product instance to be created. The `Product` object should have a `toJson` method to convert it into a plain object.
 * @param {string} sellerId - The ID of the seller to associate with the product.
 * @returns {Promise<Product | null>} A promise that resolves to a `Product` instance created from the database, or `null` if an error occurs.
 *
 * @description This function creates a new product in the database using Prisma and associates it with a seller ID. 
 * The product is passed as a `Product` object, which is converted to a plain object using the `toJson` method. 
 * If successful, the created product is returned as a `Product` instance by calling the `fromJson` method.
 * If an error occurs, it logs the error and returns `null`.
 *
 * @example
 * const product = new Product({ name: 'Smartphone', price: 500 });
 * const sellerId = '12345';
 * const createdProduct = await createBySellerId(product, sellerId);
 * if (createdProduct) {
 *     console.log('Product created:', createdProduct);
 * } else {
 *     console.error('Failed to create product');
 * }
 */    
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

/**
 * Updates an existing product in the database.
 *
 * @async
 * @function update
 * @param {Product} _product - An instance of the `Product` class containing the updated product data. 
 * The object should have an `id` field to identify the product, and any fields with `undefined`, `null`, 
 * or empty string values will be excluded from the update.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the update is successful, or `false` if it fails.
 *
 * @description This function updates an existing product in the database by filtering out invalid fields 
 * (undefined, null, empty strings, and the `id` field) from the provided `Product` object. It validates that
 * a valid `id` is provided and that there are fields to update. If both conditions are met, the update is 
 * performed using Prisma. Errors during validation or execution are logged, and the function returns `false` 
 * if any issues occur.
 *
 * @example
 * const product = new Product({ id: '12345', name: 'Updated Laptop', price: 1500 });
 * const isUpdated = await update(product);
 * if (isUpdated) {
 *     console.log('Product updated successfully.');
 * } else {
 *     console.error('Failed to update product.');
 * }
 */        
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

/**
 * Deletes a product from the database by its ID.
 *
 * @function delete
 * @param {string} id - The unique identifier of the product to delete.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the deletion is successful, 
 * or `false` if it fails. Currently, the method is not implemented.
 *
 * @description This method is intended to delete a product from the database by its ID. However, 
 * the implementation is missing and will throw an error if called. Replace the `throw` statement 
 * with the actual implementation using your database logic.
 *
 * @throws {Error} Always throws an error with the message "Method not implemented."
 *
 * @example
 * const isDeleted = await delete('12345');
 * if (isDeleted) {
 *     console.log('Product deleted successfully.');
 * } else {
 *     console.error('Failed to delete product.');
 * }
 */
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
/**
 * Finds a product in the database by its ID.
 *
 * @async
 * @function findById
 * @param {number} product_id - The unique identifier of the product to find.
 * @returns {Promise<Product | null>} A promise that resolves to a `Product` instance if found, or `null` if not found.
 *
 * @description This method queries the database using Prisma to find a product by its ID. 
 * It assumes that the `id` field is the primary key of the `Product` table. If a product is found, 
 * it is converted to a `Product` instance using the `Product.fromJson` method. If no product is 
 * found, the function returns `null`.
 *
 * @example
 * const productId = 123;
 * const product = await findById(productId);
 * if (product) {
 *     console.log('Product found:', product);
 * } else {
 *     console.error('No product found with the given ID.');
 * }
 */
    async findById(product_id: number): Promise<Product | null> {

        console.log(`Product ID findById: ${product_id}`);

        const product = await prisma.product.findUnique({
            where: {
              id: product_id,  // 'id' is assumed to be the primary key of the 'Product' table
            },
        });

        return Product.fromJson(product);
    }

/**
 * Fetches all products from the database.
 *
 * @async
 * @function findAllProducts
 * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances. If an error occurs, it resolves to an empty array.
 *
 * @description This method uses Prisma to retrieve all products from the database. The resulting data is 
 * converted into instances of the `Product` class using the `Product.fromJson` method. If an error occurs during 
 * the database query, it logs the error and returns an empty array.
 *
 * @example
 * const products = await findAllProducts();
 * if (products.length > 0) {
 *     console.log('Products found:', products);
 * } else {
 *     console.error('No products found or an error occurred.');
 * }
 */
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
    
/**
 * Finds all products associated with a specific seller ID.
 *
 * @function findBySellerId
 * @param {string} sellerId - The unique identifier of the seller whose products are to be retrieved.
 * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances associated with the given seller ID.
 * Currently, the method is not implemented.
 *
 * @description This method is intended to retrieve all products from the database that are associated with a specific seller ID. 
 * It is currently not implemented and will throw an error if called. Replace the `throw` statement with the actual implementation 
 * using your database logic.
 *
 * @throws {Error} Always throws an error with the message "Method not implemented."
 *
 * @example
 * const sellerId = 'seller123';
 * const products = await findBySellerId(sellerId);
 * if (products.length > 0) {
 *     console.log('Products found for seller:', products);
 * } else {
 *     console.error('No products found for the given seller ID.');
 * }
 */
    findBySellerId(sellerId: string): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

/**
 * Finds all products that belong to a specific category.
 *
 * @async
 * @function findByCategory
 * @param {keyof typeof ProductTypeEnum} categoryKey - The category key to filter products. 
 * Must match a key in the `ProductTypeEnum` enumeration.
 * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances in the specified category.
 * If an error occurs, it resolves to an empty array.
 *
 * @description This method queries the database using Prisma to retrieve all products that match the specified category.
 * It filters the products by enforcing an exact match on the `category` field. The results are converted into 
 * `Product` instances using the `Product.fromJson` method. If an error occurs during the query, it logs the error and 
 * returns an empty array.
 *
 * @example
 * const categoryKey = 'Electronics';
 * const products = await findByCategory(categoryKey);
 * if (products.length > 0) {
 *     console.log('Products in category:', products);
 * } else {
 *     console.error('No products found in the specified category.');
 * }
 */
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

/**
 * Finds all products with a specific price.
 *
 * @async
 * @function findByPrice
 * @param {number} price - The exact price to filter products by. 
 * This method will return products that match the provided price per unit.
 * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances that have the specified price.
 * If an error occurs, it resolves to an empty array.
 *
 * @description This method queries the database using Prisma to retrieve all products that match the specified price.
 * The query checks for an exact match on the `price_per_unit` field. If products are found, they are converted into 
 * `Product` instances using the `Product.fromJson` method. If an error occurs during the query, it logs the error and 
 * returns an empty array.
 *
 * @example
 * const price = 199.99;
 * const products = await findByPrice(price);
 * if (products.length > 0) {
 *     console.log('Products found at the specified price:', products);
 * } else {
 *     console.error('No products found with the given price.');
 * }
 */
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

/**
 * Finds all products that contain a specific product name.
 *
 * @async
 * @function findByProductName
 * @param {string} productName - The product name or part of it to filter products by. 
 * The search is case-insensitive and will match any product name containing the provided string.
 * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances that contain the specified product name.
 * If an error occurs, it resolves to an empty array.
 *
 * @description This method queries the database using Prisma to retrieve all products whose names contain the specified 
 * product name string. The search is case-insensitive, achieved by converting both the `productName` input and the 
 * `product_name` field in the database to lowercase. The results are then converted into `Product` instances using the 
 * `Product.fromJson` method. If an error occurs during the query, it logs the error and returns an empty array.
 *
 * @example
 * const productName = 'laptop';
 * const products = await findByProductName(productName);
 * if (products.length > 0) {
 *     console.log('Products found with the specified name:', products);
 * } else {
 *     console.error('No products found with the given name.');
 * }
 */
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