// src/application/usecases/orderManagement/createOrder.ts

// import { Order } from "@/domain/entities/Order";
// import NetworkUtils from "@/lib/networkUtils";

// const endpoint = "/api/orders/create/";

// async function createOrder(body: any): Promise<Order | null> {
//   const response = await NetworkUtils.postRequest<{ message: string; data: Order }>(endpoint, body);

//   return response?.data ?? null;
// }

// export default createOrder;

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
