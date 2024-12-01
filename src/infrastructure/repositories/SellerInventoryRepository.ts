import { ISellerInvertoryRepository } from "@/application/repositories/ISellerInventoryRepository";
import { Product } from "@/domain/entities/Product";
import { ProductTypeEnum } from "@/domain/enums/ProductTypeEnum";
import { prisma } from "../database/prisma";
import { SellerInventory } from "@/domain/entities/SellerInventory";
import { IProductRepository } from "@/application/repositories/IProductRepository";
import { ProductRepository } from "./ProductRepository";

/**
 * Repository for handling Seller Inventory data.
 */
export class SellerInventoryRepository implements ISellerInvertoryRepository {
    private productRepository: IProductRepository = new ProductRepository();

    /**
     * Creates a new seller inventory entry.
     *
     * @param sellerInventory - The `SellerInventory` entity to be created.
     * @returns A promise that resolves to the created `SellerInventory` entity or `null` if an error occurs.
     */
    async create(
        sellerInventory: SellerInventory
    ): Promise<SellerInventory | null> {
        try {
            const inventory = await prisma.seller_inventory.create({
                data: sellerInventory.toJson(),
            });
            return SellerInventory.fromJson(inventory);
        } catch (e) {
            console.error("Error creating seller inventory:", e);
            return null;
        }
    }

    /**
     * Updates an existing seller inventory entry.
     *
     * @param sellerInventory - The `SellerInventory` entity to be updated.
     * @returns A promise that resolves to `true` if the update was successful, or `false` if an error occurs.
     */
    async update(sellerInventory: SellerInventory): Promise<boolean> {
        try {
            await prisma.seller_inventory.update({
                where: { id: sellerInventory.id },
                data: sellerInventory.toJson(),
            });
            return true;
        } catch (error) {
            console.error("Error updating seller inventory:", error);
            return false;
        }
    }

    /**
     * Deletes a seller inventory entry by its ID.
     *
     * @param id - The ID of the seller inventory to be deleted.
     * @returns A promise that resolves to `true` if the deletion was successful, or `false` if an error occurs.
     */
    async delete(id: number): Promise<boolean> {
        try {
            await prisma.seller_inventory.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting seller inventory:", error);
            return false;
        }
    }

    /**
     * Finds a seller inventory entry by its ID.
     *
     * @param id - The ID of the seller inventory.
     * @returns A promise that resolves to the `SellerInventory` entity, or `null` if not found or an error occurs.
     */
    async findById(id: number): Promise<SellerInventory | null> {
        try {
            const inventory = await prisma.seller_inventory.findUnique({
                where: { id },
            });
            return inventory ? SellerInventory.fromJson(inventory) : null;
        } catch (error) {
            console.error("Error finding seller inventory by ID:", error);
            return null;
        }
    }

    /**
     * Finds seller inventory by product ID.
     *
     * @param productId - The ID of the product.
     * @returns A promise that resolves to the `SellerInventory` entity or `null` if not found or an error occurs.
     */
    async findByProductId(productId: number): Promise<SellerInventory | null> {
        try {
            const inventory = await prisma.seller_inventory.findFirst({
                where: { product_id: productId },
            });
            return inventory ? SellerInventory.fromJson(inventory) : null;
        } catch (error) {
            console.error("Error finding seller inventory by product ID:", error);
            return null;
        }
    }

    /**
     * Finds all seller inventory records.
     *
     * @returns A promise that resolves to an array of `Product` entities.
     */
    async findAll(): Promise<Product[]> {
        try {
            const result = await prisma.seller_inventory.findMany();
            // Use Promise.all to await all async calls and filter out null results
            const products = await Promise.all(
                result.map(async (seller_inventory) => {
                    const product = await this.productRepository.findById(
                        seller_inventory.product_id
                    );
                    return product ? product : null;
                })
            );
            // Filter out null values from the products array
            return products.filter((product): product is Product => product !== null);
        } catch (e) {
            console.error("Error fetching all seller inventory:", e);
            return [];
        }
    }

    /**
     * Finds all seller inventory records that are available for sale (quantity > 0).
     *
     * @returns A promise that resolves to an array of `Product` entities.
     */
    async findAllForSale(): Promise<Product[]> {
        try {
            const result = await prisma.seller_inventory.findMany({
                where: { quantity_for_sale: { gt: 0 } },
            });
            // Use Promise.all to await all async calls and filter out null results
            const products = await Promise.all(
                result.map(async (seller_inventory) => {
                    const product = await this.productRepository.findById(
                        seller_inventory.product_id
                    );
                    return product ? product : null;
                })
            );
            // Filter out null values from the products array
            return products.filter((product): product is Product => product !== null);
        } catch (e) {
            console.error("Error fetching products for sale:", e);
            return [];
        }
    }

    /**
     * Finds seller inventory by seller ID.
     *
     * @param sellerId - The ID of the seller.
     * @returns A promise that resolves to an array of `Product` entities.
     */
    async findBySellerId(sellerId: number): Promise<Product[]> {
        try {
            const result = await prisma.seller_inventory.findMany({
                where: { seller_id: sellerId },
            });

            // Use Promise.all to await all async calls and filter out null results
            const products = await Promise.all(
                result.map(async (seller_inventory) => {
                    const product = await this.productRepository.findById(
                        seller_inventory.product_id
                    );
                    return product ? product : null;
                })
            );
            // Filter out null values from the products array
            return products.filter((product): product is Product => product !== null);
        } catch (e) {
            console.error("Error fetching products by seller id:", e);
            return [];
        }
    }

    /**
     * Finds seller inventory by price.
     *
     * @param price - The price of the product.
     * @returns A promise that resolves to an array of `Product` entities.
     * @throws Will throw an error since this method is not yet implemented.
     */
    async findByPrice(price: number): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    /**
     * Finds seller inventory by product name.
     *
     * @param productName - The name of the product.
     * @returns A promise that resolves to an array of `Product` entities.
     * @throws Will throw an error since this method is not yet implemented.
     */
    async findByProductName(productName: string): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    /**
     * Finds seller inventory by category.
     *
     * @param product_type - The type/category of the product.
     * @returns A promise that resolves to an array of `Product` entities.
     * @throws Will throw an error since this method is not yet implemented.
     */
    async findByCategory(
        product_type: typeof ProductTypeEnum
    ): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    /**
     * Retrieves seller IDs associated with a list of product IDs.
     *
     * @param productIds - An array of product IDs.
     * @returns A promise that resolves to an array of objects containing `seller_id` and `product_id`.
     */
    async getSellerIdsByProductIds(
        productIds: number[]
    ): Promise<{ seller_id: number; product_id: number }[]> {
        try {
            const sellers = await prisma.seller_inventory.findMany({
                where: {
                    product_id: { in: productIds }, // Filters seller_inventory records by product IDs
                },
                select: {
                    seller_id: true, // Select the seller_id field
                    product_id: true, // Select the product_id field
                },
            });

            // Return the array of objects containing seller_id and product_id
            return sellers.map((seller) => ({
                seller_id: seller.seller_id,
                product_id: seller.product_id,
            }));
        } catch (error) {
            console.error("Error fetching seller IDs by product IDs:", error);
            return [];
        }
    }
}
