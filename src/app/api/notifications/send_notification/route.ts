// src/app/api/orders/route.ts

import { NextResponse } from 'next/server';
import { NotificationService } from '@/infrastructure/services/NotificationService';

const notificationService = new NotificationService();

/**
 * Handles POST requests to create a new order and notify the seller
 * @async
 * @function POST
 * @param {Request} req - The request object
 * @returns {Promise<Response>} - The response object containing the result of the operation
 */

// Create a new order (Buyer purchases a product)
export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body) {
            throw new Error('No body received');
        }

        console.log('Notification body: ', body);

        // Notify the seller about the new order
        await notificationService.sendNotificationToSeller(
            body.sender_id,
            body.receiver_id,
            body.message
        );

        return NextResponse.json(
            { message: 'Notification sent successfully', data: true },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message, data: false }, { status: 400 });
    }
}

// // Update order status to shipped (Seller ships the product)
// export async function PUT(req: Request) {
//   try {
//     const { orderId } = await req.json();

//     // Update the order status in the database
//     const order = await orderRepository.updateOrderStatus(orderId, 'shipped');

//     await notificationService.sendNotification(
//       order.buyer_id,
//       order.seller_id,
//       `Your order ${orderId} has been shipped.`
//     );


//     return NextResponse.json(
//       { message: 'Order status updated to shipped', data: order },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 400 });
//   }
// }


/**
 * Handles GET requests to retrieve user notifications
 * @async
 * @function GET
 * @param {Request} req - The request object
 * @returns {Promise<Response>} - The response object containing notifications or an error message
 */
export async function GET(req: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }
        const notifications = await notificationService.getUserNotifications(Number(userId));
        return NextResponse.json(
            { data: notifications },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}