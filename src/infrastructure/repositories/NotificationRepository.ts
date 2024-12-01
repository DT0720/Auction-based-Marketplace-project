// src/infrastructure/repositories/NotificationRepository.ts

import { ISellerRepository } from "@/application/repositories/ISellerRepository";
import { prisma } from "../database/prisma";
import { SellerRepository } from "./SellerRepository";


export class NotificationRepository {

  private sellerRepository : ISellerRepository = new SellerRepository();

  async createNotification(receiverId: number, senderId: number, content: string): Promise<boolean> {
    try {

      const seller_user_id = await this.sellerRepository.findUserIdBySellerId(receiverId);

      await prisma.notifications.create({
        data: {
          reciever_id: seller_user_id ?? 0,
          sender_id: senderId,
          content: content,
          recieved_at: new Date().toISOString(),
        },
      });
      return true;
    } catch (error) {
      console.error("Error creating notification:", error);
      return false;
    }
  }

  async getNotificationsByUserId(userId: number) {
    try {
      const notifications = await prisma.notifications.findMany({
        where: {
          reciever_id: userId,
        },
        include: {
          user_notifications_sender_idTouser: {
            select: {
              name: true,
            }
          }
        },
        orderBy: {
          recieved_at: 'desc'
        },
        take: 10
      });
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
}