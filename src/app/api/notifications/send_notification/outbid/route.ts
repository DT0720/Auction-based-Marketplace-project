import { NextResponse } from 'next/server';
import { NotificationService } from '@/infrastructure/services/NotificationService';

const notificationService = new NotificationService();

/**
 * Handles POST requests to notify a buyer about being outbid.
 * 
 * This function receives a request containing a notification body with the necessary details for notifying the buyer
 * about being outbid by another user. It then calls the notification service to send the notification. 
 * If successful, it returns a 201 status with a success message. If an error occurs, it returns a 400 status with an error message.
 * 
 * @param {Request} req The incoming HTTP request object.
 * 
 * @returns {NextResponse} A `NextResponse` object with the status and message:
 *      - 201 (Created) if the notification is sent successfully.
 *      - 400 (Bad Request) if an error occurs.
 */
export async function POST(req: Request) {
    try {
        // Parse the request body
        const body = await req.json();

        // If no body is received, throw an error
        if (!body) {
            throw new Error('No body received');
        }

        // Notify the buyer of being outbid
        await notificationService.notifyBuyerOfOutBid(
            body.sender_id,
            body.receiver_id,
            body.message
        );

        // Return success response
        return NextResponse.json(
            { message: 'Notification sent successfully', data: true },
            { status: 201 }
        );
    } catch (error: any) {
        // Return error response if something goes wrong
        return NextResponse.json({ message: error.message, data: false }, { status: 400 });
    }
}
