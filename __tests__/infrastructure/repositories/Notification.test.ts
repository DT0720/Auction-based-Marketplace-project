import { NotificationService } from '../../../src/infrastructure/services/NotificationService';
import { NotificationRepository } from '../../../src/infrastructure/repositories/NotificationRepository';
import { prisma } from '../../../src/infrastructure/database/prisma';
import { Order } from '../../../src/domain/entities/Order';
import { notifyBuyerOfShipment, notifySellerOfPurchase } from '../../../src/application/usecases/NotificationServiceSystem/Notification';

jest.mock('../../../src/infrastructure/database/prisma');
jest.mock('../../../src/infrastructure/repositories/BuyerRepository');
jest.mock('../../../src/infrastructure/repositories/SellerRepository');

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let notificationRepository: NotificationRepository;

  beforeEach(() => {
    notificationService = new NotificationService();
    notificationRepository = new NotificationRepository();
    jest.clearAllMocks();
  });

  describe('Basic notification functionality', () => {
    it('should verify notification content format', async () => {
    const receiverId = 1;
    const senderId = 2;
    const message = 'Test notification';

    (prisma.notifications.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      reciever_id: receiverId,
      sender_id: senderId,
      content: message,
      recieved_at: new Date()
    });

      const result = await notificationRepository.createNotification(
        receiverId,
        senderId, 
        message
      );

      expect(result).toBe(true);
    expect(prisma.notifications.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          content: message
        })
    });
  });

    it('should handle invalid receiver ID', async () => {
      const invalidReceiverId = -1;
      const senderId = 2;
      const message = 'Test notification';

      (prisma.notifications.create as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid receiver ID')
      );

      const result = await notificationRepository.createNotification(
        invalidReceiverId,
        senderId,
        message  
      );

      expect(result).toBe(false);
  });

    it('should verify notification timestamp', async () => {
    const receiverId = 1;
    const senderId = 2; 
    const message = 'Test notification';
      const currentTime = new Date();

      (prisma.notifications.create as jest.Mock).mockImplementationOnce(({data}) => {
        expect(data.recieved_at).toBeInstanceOf(Date);
        expect(data.recieved_at.getTime()).toBeGreaterThanOrEqual(currentTime.getTime());
        return Promise.resolve({...data, id: 1});
      });

      await notificationRepository.createNotification(receiverId, senderId, message);
  });
});

  describe('Order notification system', () => {
    const mockOrder: Order = {
      id: 1,
      buyer_id: 1,
      seller_id: 2,
      product_id: 3,
      status: 'pending',
      quantity: 1
    };

    it('should verify seller notification message format', async () => {
      const mockSeller = { user_id: 2, username: 'seller' };
      const sellerRepo = jest.requireMock('../../../src/infrastructure/repositories/SellerRepository');
      sellerRepo.SellerRepository.prototype.findById.mockResolvedValueOnce(mockSeller);

      const notificationSpy = jest.spyOn(notificationService, 'sendNotification');

      await notifySellerOfPurchase(mockOrder);

      expect(notificationSpy).toHaveBeenCalledWith(
        mockSeller.user_id,
        mockOrder.buyer_id,
        expect.stringContaining(`product ${mockOrder.product_id}`)
      );
    });

    it('should handle notification failure gracefully', async () => {
      const mockBuyer = { user_id: 1, username: 'buyer' };
      const buyerRepo = jest.requireMock('../../../src/infrastructure/repositories/BuyerRepository');
      buyerRepo.BuyerRepository.prototype.findById.mockResolvedValueOnce(mockBuyer);

      jest.spyOn(notificationService, 'sendNotification')
        .mockRejectedValueOnce(new Error('Notification failed'));

      await expect(notifyBuyerOfShipment(mockOrder))
        .rejects
        .toThrow('Notification failed');
    });

    // Fix for failing tests:
    // 1. Ensure proper mock implementations
    beforeEach(() => {
      const mockNotificationService = {
        sendNotification: jest.fn().mockResolvedValue(undefined)
      };
      jest.spyOn(NotificationService.prototype, 'sendNotification').mockImplementation(mockNotificationService.sendNotification);
    });

    // 2. Add proper type checking
    it('should validate order object properties', async () => {
      const invalidOrder = { ...mockOrder, buyer_id: undefined };
      await expect(notifyBuyerOfShipment(invalidOrder as unknown as Order))
        .rejects
        .toThrow();
    });

    // 3. Add error boundary tests
    it('should handle repository errors', async () => {
      const buyerRepo = jest.requireMock('../../../src/infrastructure/repositories/BuyerRepository');
      buyerRepo.BuyerRepository.prototype.findById.mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      await expect(notifyBuyerOfShipment(mockOrder))
        .rejects
        .toThrow('Database connection failed');
    });
  });
});