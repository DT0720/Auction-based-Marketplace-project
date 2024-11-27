// src/app/api/orders/route.ts

import { NextResponse } from 'next/server';
import { OrderRepository } from '../../../../infrastructure/repositories/OrderRepository';
import { NotificationService } from '../../../../infrastructure/services/NotificationService';

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

    // Notify the buyer that the product has been shipped
    await notificationService.sendNotification(
      order.buyer_id,
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