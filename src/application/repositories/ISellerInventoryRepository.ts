import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { Product } from "../../domain/entities/Product";
import { SellerInventory } from "@/domain/entities/SellerInventory";

/**
 * Interface for the Seller Inventory Repository, which defines the methods to interact with the seller's inventory data.
 */
export interface ISellerInvertoryRepository {
    /**
     * Creates a new seller inventory entry.
     * 
     * @param sellerInventory - The seller inventory entity to be created.
     * @returns A promise that resolves to the created `SellerInventory` or `null` if creation fails.
     */
    create(sellerInventory: SellerInventory): Promise<SellerInventory | null>;

    /**
     * Updates an existing seller inventory entry.
     * 
     * @param sellerInventory - The seller inventory entity to be updated.
     * @returns A promise that resolves to a boolean indicating whether the update was successful.
     */
    update(sellerInventory: SellerInventory): Promise<boolean>;

    /**
     * Deletes a seller inventory entry by ID.
     * 
     * @param id - The ID of the seller inventory to be deleted.
     * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
     */
    delete(id: number): Promise<boolean>;

    /**
     * Retrieves all products in the inventory.
     * 
     * @returns A promise that resolves to an array of `Product` entities.
     */
    findAll(): Promise<Product[]>;

    /**
     * Retrieves all products available for sale.
     * 
     * @returns A promise that resolves to an array of `Product` entities available for sale.
     */
    findAllForSale(): Promise<Product[]>;

    /**
     * Finds a seller inventory entry by its ID.
     * 
     * @param id - The ID of the seller inventory.
     * @returns A promise that resolves to the `SellerInventory` entity or `null` if not found.
     */
    findById(id: number): Promise<SellerInventory | null>;

    /**
     * Retrieves all products associated with a specific seller.
     * 
     * @param sellerId - The ID of the seller.
     * @returns A promise that resolves to an array of `Product` entities.
     */
    findBySellerId(sellerId: number): Promise<Product[]>;

    /**
     * Finds products by their price.
     * 
     * @param price - The price of the products to find.
     * @returns A promise that resolves to an array of `Product` entities matching the price.
     */
    findByPrice(price: number): Promise<Product[]>;

    /**
     * Finds products by their name.
     * 
     * @param productName - The name of the product to search for.
     * @returns A promise that resolves to an array of `Product` entities matching the name.
     */
    findByProductName(productName: string): Promise<Product[]>;

    /**
     * Finds a seller inventory entry by the product ID.
     * 
     * @param productId - The ID of the product.
     * @returns A promise that resolves to the `SellerInventory` entity or `null` if not found.
     */
    findByProductId(productId: number): Promise<SellerInventory | null>;

    /**
     * Finds products by their category.
     * 
     * @param product_type - The product type enum specifying the category.
     * @returns A promise that resolves to an array of `Product` entities matching the category.
     */
    findByCategory(product_type: typeof ProductTypeEnum): Promise<Product[]>;

    /**
     * Retrieves seller IDs associated with a list of product IDs.
     * 
     * @param productIds - An array of product IDs.
     * @returns A promise that resolves to an array of objects containing `seller_id` and `product_id`.
     */
    getSellerIdsByProductIds(productIds: number[]): Promise<{ seller_id: number; product_id: number }[]>;
}
