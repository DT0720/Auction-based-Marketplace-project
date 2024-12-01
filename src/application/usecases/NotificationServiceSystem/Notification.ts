// NotificationService.ts

import { OrderDetails } from '@/domain/entities/OrderDetails';
import NetworkUtils, { ApiResponse } from '@/lib/networkUtils';

const endpoint = '/api/notifications/send_notification/';

// Function to notify the seller of a new purchase
export async function notifySellerOfPurchase(orderDetails: OrderDetails, sender_id: number): Promise<boolean> {

  const body = { 
    receiver_id: orderDetails.sellerId, 
    sender_id: sender_id, 
    message: `You have received a new order for product ${orderDetails.productId} from buyer ${sender_id}.`
  }

  // Fetch the seller details using the seller ID from the order
  const response = await NetworkUtils.postRequest<ApiResponse<boolean>>(endpoint, body);

  if (!response) {
    throw new Error('Failed to send notification');
  }

  return response.data;
}
export async function notifyBuyerOfOutBid(auction_id: number, sender_id: number,receiver_id:number): Promise<boolean> {
  const body = {   
    sender_id: sender_id,
    receiver_id: receiver_id,
    message: `You have been outbid on auction ${auction_id}.`
  };

  const response = await NetworkUtils.postRequest<ApiResponse<boolean>>(endpoint+"outbid", body);

  if (!response) {
    throw new Error('Failed to send notification');
  }

  return response.data;
}

// Function to notify the buyer when their order has been shipped
// export async function notifyBuyerOfShipment(order: Order): Promise<void> {
//   const buyerRepository = new BuyerRepository();
//   const notificationService = new ImportedNotificationService();

//   // Fetch the buyer details using the buyer ID from the order
//   const buyer = await buyerRepository.findById(order.buyer_id);
//   if (!buyer) {
//     throw new Error('Buyer not found');
//   }

//   // Create the notification message
//   const message = `Your order for product ${order.product_id} has been shipped.`;

//   // Send the notification to the buyer
//   await notificationService.sendNotification(buyer.user_id, order.seller_id, message);
// }