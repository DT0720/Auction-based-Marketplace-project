import { Order } from "@/domain/entities/Order";
import { OrderDetails } from "@/domain/entities/OrderDetails";
import NetworkUtils from "@/lib/networkUtils";

const endpoint = "/api/orders/create/";

interface CreateOrderPayload {
  buyer_id: number;
  status: string;
  total_amount: number;
  orderDetails: {
    product_id: number;
    quantity: number;
    seller_id: number;
  }[];
}

/**
 * Creates an order by sending a POST request to the API.
 * 
 * @param payload - The data required to create an order.
 * @param payload.buyer_id - The ID of the buyer placing the order.
 * @param payload.status - The status of the order (e.g., "pending", "completed").
 * @param payload.total_amount - The total amount of the order.
 * @param payload.orderDetails - An array of order details containing product and quantity for each item.
 * @param payload.orderDetails.product_id - The ID of the product being ordered.
 * @param payload.orderDetails.quantity - The quantity of the product being ordered.
 * @param payload.orderDetails.seller_id - The ID of the seller of the product.
 * 
 * @returns A promise that resolves to an object containing the created order and its details, or `null` if the creation fails.
 * 
 * @throws {Error} Throws an error if the API request fails or returns an invalid response.
 */
async function createOrder(payload: CreateOrderPayload): Promise<{ order: Order; orderDetails: OrderDetails[] } | null> {
  try {
    // Sending the request to create the order
    const response = await NetworkUtils.postRequest<{
      message: string;
      data: { order: Order; orderDetails: OrderDetails[] };
    }>(endpoint, payload);

    // If the API returns data
    if (response?.data) {
      const { order, orderDetails } = response.data;
  
      // Return the created order and its associated order details
      return {
        order: order, // Mapping order data to Order entity
        orderDetails: orderDetails, // Returning mapped order details
      };
    }

    // If API response doesn't contain data
    console.error("API did not return any data.");
    return null;
  } catch (error: any) {
    // Logging error and handling response errors
    console.error("Error creating order:", error);

    if (error?.response && error.response.data) {
      console.error("API Error:", error.response.data.message);
    }

    // Throwing a user-friendly error message
    throw new Error("Failed to create order. Please try again.");
  }
}

export default createOrder;
