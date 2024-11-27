// src/infrastructure/services/NotificationService.ts

export class NotificationService {
    async sendNotification(userId: number, message: string): Promise<void> {
      // Logic to send a notification (email, SMS, in-app, etc.)
      console.log(`Sending notification to user ${userId}: ${message}`);
    }
  }