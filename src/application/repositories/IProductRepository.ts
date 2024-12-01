import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { Product } from "../../domain/entities/Product";

export interface IProductRepository {

    /**
     * Creates a new product in the database.
     *
     * @param {Product} product - The product instance to be created.
     * @returns {Promise<Product | null>} A promise that resolves to the created `Product` instance if successful, or `null` if the creation fails.
     */
    create(product: Product): Promise<Product | null>;

    /**
     * Creates a new product and associates it with a seller by seller ID.
     *
     * @param {Product} product - The product instance to be created.
     * @param {string} sellerId - The ID of the seller to associate with the product.
     * @returns {Promise<Product | null>} A promise that resolves to the created `Product` instance if successful, or `null` if the creation fails.
     */
    createBySellerId(product: Product, sellerId: string): Promise<Product | null>;
    
    /**
     * Updates an existing product in the database.
     *
     * @param {Product} product - The product instance with updated data.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the update is successful, or `false` if the update fails.
     */
    update(product: Product): Promise<boolean>;
    
    /**
     * Deletes a product by its ID.
     *
     * @param {string} id - The unique identifier of the product to delete.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the deletion is successful, or `false` if the deletion fails.
     */
    delete(id: string): Promise<boolean>;

    /**
     * Finds a product by its ID.
     *
     * @param {number} id - The unique identifier of the product.
     * @returns {Promise<Product | null>} A promise that resolves to the `Product` instance if found, or `null` if not found.
     */
    findById(id: number): Promise<Product | null>;
    
    /**
     * Fetches all products from the database.
     *
     * @returns {Promise<Product[]>} A promise that resolves to an array of all `Product` instances.
     */
    findAllProducts(): Promise<Product[]>;
    
    /**
     * Finds products by seller ID.
     *
     * @param {string} sellerId - The unique identifier of the seller whose products are to be retrieved.
     * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances associated with the seller.
     */
    findBySellerId(sellerId: string): Promise<Product[]>;
    
    /**
     * Finds products by price.
     *
     * @param {number} price - The exact price to filter products by.
     * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances that match the specified price.
     */
    findByPrice(price: number): Promise<Product[]>;
    
    /**
     * Finds products by product name.
     *
     * @param {string} productName - The product name or part of it to filter products by. The search is case-insensitive.
     * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances that contain the specified product name.
     */
    findByProductName(productName: string): Promise<Product[]>;
    
    /**
     * Finds products by category.
     *
     * @param {keyof typeof ProductTypeEnum} categoryKey - The category key to filter products by. Must match a key in the `ProductTypeEnum` enumeration.
     * @returns {Promise<Product[]>} A promise that resolves to an array of `Product` instances in the specified category.
     */
    findByCategory(categoryKey: keyof typeof ProductTypeEnum): Promise<Product[]>;
}