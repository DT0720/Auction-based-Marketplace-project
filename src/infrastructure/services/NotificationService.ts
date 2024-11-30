// src/infrastructure/services/NotificationService.ts

export class NotificationService {
    async sendNotification(userId: number, message: string): Promise<void> {
      // Logic to send a notification (email, SMS, in-app, etc.)
      console.log(`Sending notification to user ${userId}: ${message}`);
    }
}
// src/services/notificationService.ts
export async function sendOutbidNotification(bidderId: number, auctionId: number, newBidAmount: number) {
  // Implement the logic to send a notification to the bidder
  // This could be an email, SMS, push notification, etc.
  console.log(`Sending outbid notification to bidder ${bidderId} for auction ${auctionId} with new bid amount ${newBidAmount}`);
  // Example: await emailService.sendOutbidEmail(bidderId, auctionId, newBidAmount);
}

export async function sendNotification(userId: number, message: string): Promise<void> {
  const notificationService = new NotificationService();
  await notificationService.sendNotification(userId, message);
}