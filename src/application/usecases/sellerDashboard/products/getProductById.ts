import { Product } from "@/domain/entities/Product";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getById/";

/**
 * Fetches a product by its ID.
 *
 * @param {number} id - The ID of the product to fetch.
 * @returns {Promise<Product | null>} - A promise that resolves to the product object or null if not found.
 * @throws {Error} - Throws an error if the network request fails.
 */

export async function getProductById(id: number): Promise<Product | null> {
    const response = await NetworkUtils.getRequest<ApiResponse<Product>>(
        endpoint + id
    );

    return response?.data ?? null;
}

/**
 * Fetches all products associated with a specific seller ID.
 *
 * @param {number} id - The ID of the seller.
 * @returns {Promise<Product[]>} - A promise that resolves to an array of products associated with the seller.
 * @throws {Error} - Throws an error if the network request fails.
 */

export async function getProductBySellerId(id: number): Promise<Product[]> {
    const response = await NetworkUtils.getRequest<ApiResponse<Product[]>>(
        endpoint + "/by_seller_id/" + id
    );

    return response?.data ?? [];
}
