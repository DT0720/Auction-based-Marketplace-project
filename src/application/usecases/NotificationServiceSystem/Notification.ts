// NotificationService.ts

import { SellerRepository } from '@/infrastructure/repositories/SellerRepository';
import { BuyerRepository } from '@/infrastructure/repositories/BuyerRepository';
import { NotificationService as ImportedNotificationService } from '@/infrastructure/services/NotificationService';
import { Order } from '@/domain/entities/Order';

// Function to notify the seller of a new purchase
export async function notifySellerOfPurchase(order: Order): Promise<void> {
  const sellerRepository = new SellerRepository();
  const notificationService = new ImportedNotificationService();

  // Fetch the seller details using the seller ID from the order
  const seller = await sellerRepository.findById(order.seller_id);
  if (!seller) {
    throw new Error('Seller not found');
  }

}

// Function to notify the buyer when their order has been shipped
export async function notifyBuyerOfShipment(order: Order): Promise<void> {
  const buyerRepository = new BuyerRepository();
  const notificationService = new ImportedNotificationService();

  // Fetch the buyer details using the buyer ID from the order
  const buyer = await buyerRepository.findById(order.buyer_id);
  if (!buyer) {
    throw new Error('Buyer not found');
  }

  // Create the notification message
  const message = `Your order for product ${order.product_id} has been shipped.`;

  // Send the notification to the buyer
  await notificationService.sendNotification(buyer.user_id, order.seller_id, message);
}