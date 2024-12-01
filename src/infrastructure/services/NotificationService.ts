// src/infrastructure/services/NotificationService.ts

import { NotificationRepository } from "../repositories/NotificationRepository";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async sendNotification(receiverId: number, senderId: number, message: string): Promise<void> {
    const success = await this.notificationRepository.createNotification(
      receiverId,
      senderId,
      message
    );
    
    if (!success) {
      throw new Error("Failed to send notification");
    }
    
    console.log(`Notification stored: receiver=${receiverId}, sender=${senderId}, message=${message}`);
  }

  async getUserNotifications(userId: number) {
    try {
      if (!userId) throw new Error('User ID is required');
      const notifications = await this.notificationRepository.getNotificationsByUserId(userId);
      return notifications;
    } catch (error) {
      console.error('NotificationService error:', error);
      throw error;
    }
  }
}

export async function sendOutbidNotification(bidderId: number, senderId: number, auctionId: number, newBidAmount: number) {
    const notificationService = new NotificationService();
    const message = `You have been outbid on auction ${auctionId}. The new bid amount is ${newBidAmount}.`;
    await notificationService.sendNotification(bidderId, senderId, message);
}