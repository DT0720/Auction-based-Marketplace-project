import NetworkUtils, { ApiResponse } from '@/lib/networkUtils';
import { Orders } from '@/domain/entities/Order';
import { OrderStatusEnum } from '@/domain/enums/OrderStatusEnum';

const endpoint = '/api/users/user-orders/';

// Fetch all orders for a user
export async function findByBuyerId(userId: number): Promise<Orders[]> {
    console.log(" User Id " + userId)
    const response = await NetworkUtils.getRequest<ApiResponse<Orders[]>>(endpoint + userId);
    return response?.data ?? [];
}