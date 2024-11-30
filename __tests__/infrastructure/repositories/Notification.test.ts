// src/infrastructure/services/NotificationService.test.ts

import { NotificationService } from '../../../src/infrastructure/services/NotificationService';

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = new NotificationService();
  });

  it('should send a notification to the user', async () => {
    const userId = 1;
    const message = 'This is a test notification';

    // Mock the console.log function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Call the sendNotification method
    await notificationService.sendNotification(userId, message);

    // Assert that console.log was called with the correct message
    expect(consoleSpy).toHaveBeenCalledWith(`Sending notification to user ${userId}: ${message}`);

    // Restore the original console.log function
    consoleSpy.mockRestore();
  });
});