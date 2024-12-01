// src/infrastructure/services/NotificationService.ts

import { NotificationRepository } from "../repositories/NotificationRepository";
import { SellerRepository } from "../repositories/SellerRepository";
import { BuyerRepository } from "../repositories/BuyerRepository";

/**
 * @class NotificationService
 * @classdesc Service class for handling notifications
 */
export class NotificationService {
    private notificationRepository: NotificationRepository;
    private sellerRepository: SellerRepository;
    private buyerRepository: BuyerRepository;

    /**
     * @constructor
     * Initializes the NotificationService with instances of NotificationRepository, SellerRepository, and BuyerRepository
     */
    constructor() {
        this.notificationRepository = new NotificationRepository();
        this.sellerRepository = new SellerRepository();
        this.buyerRepository = new BuyerRepository();
    }

    /**
     * Sends a notification to a seller
     * @param {number} senderId - ID of the sender
     * @param {number} receiverId - ID of the receiver (seller)
     * @param {string} message - Notification message
     * @returns {Promise<void>}
     * @throws Will throw an error if the notification fails to send
     */
    async sendNotificationToSeller(
        senderId: number,
        receiverId: number,
        message: string
    ): Promise<void> {
        console.log(
            `sendNotificationToSellerBefore: receiver=${receiverId}, sender=${senderId}, message=${message}`
        );

        const seller_user_id = await this.sellerRepository.findUserIdBySellerId(
            receiverId
        );

        console.log(
            `sendNotificationToSeller: receiver=${seller_user_id}, sender=${senderId}, message=${message}`
        );

        const success = await this.notificationRepository.createNotification(
            seller_user_id ?? 0,
            senderId,
            message
        );

        if (!success) {
            throw new Error("Failed to send notification");
        }

        console.log(
            `Notification stored: receiver=${receiverId}, sender=${senderId}, message=${message}`
        );
    }
    /**
     * Notifies a buyer of being outbid
     * @param {number} sender_id - ID of the sender
     * @param {number} receiver_id - ID of the receiver (buyer)
     * @param {string} message - Notification message
     * @returns {Promise<void>}
     * @throws Will throw an error if the notification fails to send
     */

    async notifyBuyerOfOutBid(
        sender_id: number,
        receiver_id: number,
        message: string
    ): Promise<void> {
        const buyer_id = await this.buyerRepository.findUserIdBybuyerId(
            receiver_id
        );

        const success = await this.notificationRepository.createNotification(
            buyer_id ?? 0,
            sender_id,
            message
        );

        if (!success) {
            throw new Error("Failed to send notification");
        }
    }
    /**
     * Retrieves notifications for a user
     * @param {number} userId - ID of the user
     * @returns {Promise<any[]>} - Array of notifications
     * @throws Will throw an error if the user ID is not provided or if there is an error retrieving notifications
     */
    async getUserNotifications(userId: number) {
        try {
            if (!userId) throw new Error("User ID is required");
            const notifications =
                await this.notificationRepository.getNotificationsByUserId(userId);
            return notifications;
        } catch (error) {
            console.error("NotificationService error:", error);
            throw error;
        }
    }
}
