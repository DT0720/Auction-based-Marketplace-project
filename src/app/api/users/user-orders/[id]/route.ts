import { NextResponse } from 'next/server';
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository';

const orderRepository = new OrderRepository();

/**
 * Handles GET requests to retrieve orders by user ID
 * @async
 * @function GET
 * @param {Request} req - The request object
 * @param {Object} context - The context object containing route parameters
 * @param {Promise<{ id: string }>} context.params - The route parameters containing the user ID
 * @returns {Promise<Response>} - The response object containing the orders or an error message
 */

export async function GET(req: Request, context: { params:Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        // Parse and validate user ID
        const userId = parseInt(id, 10);
        if (!userId) {
            throw new Error('Valid User ID is required');
        }

        // Fetch all orders for the given user ID
        const orders = await orderRepository.getByBuyerId(userId);

        // if (!orders || orders.length === 0) {
        //     return NextResponse.json(
        //         { message: `No orders found for user with ID ${userId}.`, data: [] },
        //         { status: 404 }
        //     );
        // }

        return NextResponse.json(
            {
                message: `Orders fetched successfully for user ID ${userId}.`,
                data: orders,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch orders.' },
            { status: 400 }
        );
    }
}


