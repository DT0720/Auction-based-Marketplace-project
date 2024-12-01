import NetworkUtils, { ApiResponse } from '@/lib/networkUtils';
import { Order } from '@/domain/entities/Order';

const endpoint = '/api/orders/get/';

/**
 * Fetches all orders for a given buyer by their buyer ID.
 * 
 * @param buyerId - The ID of the buyer whose orders are to be retrieved.
 * 
 * @returns A promise that resolves to an array of `Order` objects, or an empty array if no orders are found.
 */
export async function findByBuyerId(buyerId: number): Promise<Order[]> {
    const response = await NetworkUtils.getRequest<ApiResponse<Order[]>>(endpoint + buyerId);
    return response?.data ?? [];
}


