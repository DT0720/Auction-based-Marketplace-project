// src/infrastructure/repositories/NotificationRepository.ts

import { prisma } from "../database/prisma";


export class NotificationRepository {
  async createNotification(receiverId: number, senderId: number, content: string): Promise<boolean> {
    try {
      await prisma.notifications.create({
        data: {
          reciever_id: receiverId,
          sender_id: senderId,
          content: content,
          recieved_at: new Date(),
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