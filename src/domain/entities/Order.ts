// src/domain/entities/Order.ts

// Define the Order class representing an order in the system
export class Order {
    constructor(
      public id: number, // Unique identifier for the order
      public buyer_id: number, // ID of the buyer who placed the order
      public seller_id: number,  // ID of the seller who is fulfilling the order
      public product_id: number, // ID of the product being ordered
      public quantity: number, // Quantity of the product ordered
      public status: string // Status of the order (e.g., 'pending', 'shipped')
    ) {}
  
    // Static method to create an Order instance from a JSON object
    static fromJson(data: any): Order {
      return new Order(
        data.id,
        data.buyer_id,
        data.seller_id,
        data.product_id,
        data.quantity,
        data.status
      );
    }
  }