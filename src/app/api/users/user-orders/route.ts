import { NextResponse } from 'next/server';
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository';

const orderRepository = new OrderRepository();

// Handle GET requests for fetching user orders
export async function GET(req: Request) {
    try {
        const userId = req.url.split('/').pop(); // Extract user ID from the URL
        const orders = await orderRepository.findByBuyerId(Number(userId)); // Fetch orders by buyer ID

        return NextResponse.json(orders, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch orders' },
            { status: 400 }
        );
    }
}

// Handle GET requests for fetching returned orders
export async function GET_RETURNED(req: Request) {
    try {
        const returnedOrders = await orderRepository.findReturnedOrders(); // Fetch returned orders

        return NextResponse.json(returnedOrders, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch returned orders' },
            { status: 400 }
        );
    }
}

// Handle GET requests for fetching canceled orders
export async function GET_CANCELED(req: Request) {
    try {
        const canceledOrders = await orderRepository.findCanceledOrders(); // Fetch canceled orders

        return NextResponse.json(canceledOrders, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch canceled orders' },
            { status: 400 }
        );
    }
}