// src/infrastructure/repositories/NotificationRepository.ts

import { ISellerRepository } from "@/application/repositories/ISellerRepository";
import { prisma } from "../database/prisma";
import { SellerRepository } from "./SellerRepository";

/**
 * @class NotificationRepository
 * @classdesc Repository class for handling notification-related database operations
 */

export class NotificationRepository {

    private sellerRepository: ISellerRepository = new SellerRepository();
     /**
     * Creates a new notification
     * @param {number} receiverId - The ID of the user receiving the notification
     * @param {number} senderId - The ID of the user sending the notification
     * @param {string} content - The content of the notification
     * @returns {Promise<boolean>} - Returns true if the notification was created successfully, otherwise false
     */

    async createNotification(receiverId: number, senderId: number, content: string): Promise<boolean> {
        try {



            await prisma.notifications.create({
                data: {
                    reciever_id: receiverId ?? 0,
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
    /**
     * Retrieves notifications for a user by their user ID
     * @param {number} userId - The ID of the user
     * @returns {Promise<any[]>} - An array of notifications
     * @throws Will throw an error if there is an issue retrieving notifications
     */

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