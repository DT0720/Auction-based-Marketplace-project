// __tests__/infrastructure/services/NotificationService.test.ts

import { NotificationService } from '../../../src/infrastructure/services/NotificationService';
import { NotificationRepository } from '../../../src/infrastructure/repositories/NotificationRepository';
import { SellerRepository } from '../../../src/infrastructure/repositories/SellerRepository';
import { BuyerRepository } from '../../../src/infrastructure/repositories/BuyerRepository';

// Mock implementations
jest.mock('../../../src/infrastructure/repositories/NotificationRepository', () => ({
  NotificationRepository: jest.fn().mockImplementation(() => ({
    createNotification: jest.fn(),
    getNotificationsByUserId: jest.fn()
  }))
}));

jest.mock('../../../src/infrastructure/repositories/SellerRepository', () => ({
  SellerRepository: jest.fn().mockImplementation(() => ({
    findUserIdBySellerId: jest.fn()
  }))
}));

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

  describe('sendNotification', () => {
    it('should send notification successfully', async () => {
      mockSellerRepo.findUserIdBySellerId.mockResolvedValue(2);
      mockNotificationRepo.createNotification.mockResolvedValue(true);

      await notificationService.sendNotification(1, 2, 'test');

      expect(mockSellerRepo.findUserIdBySellerId).toHaveBeenCalledWith(2);
      expect(mockNotificationRepo.createNotification).toHaveBeenCalledWith(2, 1, 'test');
    });
  });

  describe('notifyBuyerOfOutBid', () => {
    it('should notify buyer successfully', async () => {
      mockBuyerRepo.findUserIdBybuyerId.mockResolvedValue(2);
      mockNotificationRepo.createNotification.mockResolvedValue(true);

      await notificationService.notifyBuyerOfOutBid(1, 2, 'outbid');

      expect(mockBuyerRepo.findUserIdBybuyerId).toHaveBeenCalledWith(2);
      expect(mockNotificationRepo.createNotification).toHaveBeenCalledWith(2, 1, 'outbid');
    });
  });
});