import NetworkUtils, { ApiResponse } from '@/lib/networkUtils';
import { Order } from '@/domain/entities/Order';

const endpoint = '/api/orders/get/';

// Fetch all orders for a user
export async function findByBuyerId(buyerId: number): Promise<Order[]> {
    const response = await NetworkUtils.getRequest<ApiResponse<Order[]>>(endpoint + buyerId);
    return response?.data ?? [];
}


