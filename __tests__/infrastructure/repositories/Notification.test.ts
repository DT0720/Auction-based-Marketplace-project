/**
 * @fileoverview Tests for the NotificationService class
 * @description Unit tests for notification functionality including seller notifications,
 * buyer notifications for outbids, and user notification retrieval
 * @requires NotificationService
 * @requires NotificationRepository 
 * @requires SellerRepository
 * @requires BuyerRepository
 */

import { NotificationService } from '../../../src/infrastructure/services/NotificationService';
import { NotificationRepository } from '../../../src/infrastructure/repositories/NotificationRepository';
import { SellerRepository } from '../../../src/infrastructure/repositories/SellerRepository';
import { BuyerRepository } from '../../../src/infrastructure/repositories/BuyerRepository';

/**
 * @jest-environment node
 */

/**
 * @description Mock implementation for NotificationRepository
 * @mocks NotificationRepository
 * @implements createNotification - Creates a new notification
 * @implements getNotificationsByUserId - Retrieves notifications for a user
 */
jest.mock('../../../src/infrastructure/repositories/NotificationRepository', () => ({
    NotificationRepository: jest.fn().mockImplementation(() => ({
        createNotification: jest.fn(),
        getNotificationsByUserId: jest.fn()
    }))
}));

/**
 * @description Mock implementation for SellerRepository
 * @mocks SellerRepository
 * @implements findUserIdBySellerId - Finds user ID associated with seller
 */
jest.mock('../../../src/infrastructure/repositories/SellerRepository', () => ({
    SellerRepository: jest.fn().mockImplementation(() => ({
        findUserIdBySellerId: jest.fn()
    }))
}));

/**
 * @description Mock implementation for BuyerRepository
 * @mocks BuyerRepository
 * @implements findUserIdBybuyerId - Finds user ID associated with buyer
 */
jest.mock('../../../src/infrastructure/repositories/BuyerRepository', () => ({
    BuyerRepository: jest.fn().mockImplementation(() => ({
        findUserIdBybuyerId: jest.fn()
    }))
}));

describe('NotificationService', () => {
    let notificationService: NotificationService;
    let mockNotificationRepo: any;
    let mockSellerRepo: any;
    let mockBuyerRepo: any;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Get mock instances
        notificationService = new NotificationService();
        mockNotificationRepo = (NotificationRepository as jest.Mock).mock.results[0].value;
        mockSellerRepo = (SellerRepository as jest.Mock).mock.results[0].value;
        mockBuyerRepo = (BuyerRepository as jest.Mock).mock.results[0].value;
    });

    describe('getUserNotifications', () => {
        it('should retrieve notifications for a user', async () => {
            const mockNotifications = [{
                id: 1,
                reciever_id: 1,
                sender_id: 2,
                content: 'Test notification',
                recieved_at: new Date(),
                user_notifications_sender_idTouser: {
                    name: 'Test User'
                }
            }];

            mockNotificationRepo.getNotificationsByUserId.mockResolvedValue(mockNotifications);

            const result = await notificationService.getUserNotifications(1);

            expect(mockNotificationRepo.getNotificationsByUserId).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockNotifications);
        });

        it('should throw error for invalid user id', async () => {
            await expect(notificationService.getUserNotifications(0))
                .rejects.toThrow('User ID is required');
        });
    });

    describe('sendNotificationToSeller', () => {
        it('should send notification to seller successfully', async () => {
            mockSellerRepo.findUserIdBySellerId.mockResolvedValue(2);
            mockNotificationRepo.createNotification.mockResolvedValue(true);

            await notificationService.sendNotificationToSeller(1, 2, 'test');

            expect(mockSellerRepo.findUserIdBySellerId).toHaveBeenCalledWith(2);
            expect(mockNotificationRepo.createNotification).toHaveBeenCalledWith(2, 1, 'test');
        });

        it('should throw error if notification fails', async () => {
            mockSellerRepo.findUserIdBySellerId.mockResolvedValue(2);
            mockNotificationRepo.createNotification.mockResolvedValue(false);

            await expect(
                notificationService.sendNotificationToSeller(1, 2, 'test')
            ).rejects.toThrow('Failed to send notification');
        });
    });

    describe('notifyBuyerOfOutBid', () => {
        it('should notify buyer of outbid successfully', async () => {
            mockBuyerRepo.findUserIdBybuyerId.mockResolvedValue(2);
            mockNotificationRepo.createNotification.mockResolvedValue(true);

            await notificationService.notifyBuyerOfOutBid(1, 2, 'outbid notification');

            expect(mockBuyerRepo.findUserIdBybuyerId).toHaveBeenCalledWith(2);
            expect(mockNotificationRepo.createNotification).toHaveBeenCalledWith(2, 1, 'outbid notification');
        });

        it('should throw error if buyer notification fails', async () => {
            mockBuyerRepo.findUserIdBybuyerId.mockResolvedValue(2);
            mockNotificationRepo.createNotification.mockResolvedValue(false);

            await expect(
                notificationService.notifyBuyerOfOutBid(1, 2, 'test')
            ).rejects.toThrow('Failed to send notification');
        });
    });
});