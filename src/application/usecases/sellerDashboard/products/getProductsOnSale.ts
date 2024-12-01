import { Product } from "@/domain/entities/Product";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/products/getAll/on_sale/";

/**
 * Fetches all products currently on sale.
 *
 * @returns {Promise<Product[]>} - A promise that resolves to an array of products currently on sale.
 * @throws {Error} - Throws an error if the network request fails.
 */

async function getProductsOnSale(): Promise<Product[]> {
    const response = await NetworkUtils.getRequest<ApiResponse<Product[]>>(
        endpoint
    );

    return response?.data ?? [];
}

export default getProductsOnSale;
