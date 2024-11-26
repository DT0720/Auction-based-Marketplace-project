import { NextResponse } from 'next/server';
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository';

const orderRepository = new OrderRepository();

// Handle GET requests for fetching user orders
export async function GET(req: Request) {
    try {
        const userId = req.url.split('/').pop(); // Extract user ID from the URL
        const orders = await orderRepository.getOrdersByUserId(Number(userId)); // Fetch orders by user ID

        return NextResponse.json(orders, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch orders' },
            { status: 400 }
        );
    }
}