// src/infrastructure/services/NotificationService.ts

import { buyer, seller } from "@prisma/client";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { SellerRepository } from "../repositories/SellerRepository";
import { BuyerRepository } from "../repositories/BuyerRepository";

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private sellerRepository:SellerRepository;
  private buyerRepository: BuyerRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.sellerRepository = new SellerRepository();
    this.buyerRepository = new BuyerRepository();
  }

  async sendNotification(senderId: number, receiverId: number, message: string): Promise<void> {
    const seller_user_id = await this.sellerRepository.findUserIdBySellerId(receiverId);
    const success = await this.notificationRepository.createNotification(
      seller_user_id ?? 0,
      senderId,
      message
    );
    
    if (!success) {
      throw new Error("Failed to send notification");
    }
    
    console.log(`Notification stored: receiver=${receiverId}, sender=${senderId}, message=${message}`);
  }
  async notifyBuyerOfOutBid(sender_id: number,receiver_id:number,message:string ): Promise<void> {
    const buyer_id = await this.buyerRepository.findUserIdBybuyerId(receiver_id);
    
    const success = await this.notificationRepository.createNotification(
        buyer_id ?? 0,
        sender_id ,
        message
      );
      
      if (!success) {
        throw new Error("Failed to send notification");
      }
      
    
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


