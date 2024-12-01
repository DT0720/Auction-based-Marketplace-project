import { NextResponse } from 'next/server';
import { NotificationService } from '@/infrastructure/services/NotificationService';

const notificationService = new NotificationService();


// Create a new order (Buyer purchases a product)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body) {
      throw new Error('No body received');
    }

    // Notify the seller about the new order
    await notificationService.notifyBuyerOfOutBid(
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