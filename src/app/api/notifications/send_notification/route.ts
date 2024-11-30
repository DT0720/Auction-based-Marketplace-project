// src/app/api/orders/route.ts


import { OrderRepository } from '../../../../infrastructure/repositories/OrderRepository';

import { NextResponse } from 'next/server';
import { NotificationService } from '@/infrastructure/services/NotificationService';

const orderRepository = new OrderRepository();
const notificationService = new NotificationService();


// Create a new order (Buyer purchases a product)
export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    // Create the order in the database
    const order = await orderRepository.createOrder(orderData);

    // Notify the seller about the new order
    await notificationService.sendNotification(
      order.seller_id,
      order.buyer_id,
      `You have a new order from buyer ${order.buyer_id} for product ${order.product_id}.`
    );

    return NextResponse.json(
      { message: 'Order created successfully', data: order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// Update order status to shipped (Seller ships the product)
export async function PUT(req: Request) {
  try {
    const { orderId } = await req.json();

    // Update the order status in the database
    const order = await orderRepository.updateOrderStatus(orderId, 'shipped');

    await notificationService.sendNotification(
      order.buyer_id,
      order.seller_id,
      `Your order ${orderId} has been shipped.`
    );
    

    return NextResponse.json(
      { message: 'Order status updated to shipped', data: order },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}


export async function GET(req: Request) {
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