export class OrderDetails {
    constructor(
      public id: number,
      public orderId: number,
      public productId: number,
      public quantity: number,
      public sellerId: number
    ) {}
  
    /**
     * Creates an `OrderDetails` instance from a raw JSON object.
     * @param {any} data - The raw JSON data.
     * @returns {OrderDetails} The created OrderDetails instance.
     */
    static fromJson(data: any): OrderDetails {
      return new OrderDetails(
        data.id,
        data.order_id,
        data.product_id,
        data.quantity,
        data.seller_id
      );
    }
  
    /**
     * Converts the `OrderDetails` instance to a plain JSON object.
     * @returns {any} The JSON representation of the OrderDetails instance.
     */
    toJson(): any {
      return {
        id: this.id,
        order_id: this.orderId,
        product_id: this.productId,
        quantity: this.quantity,
        seller_id: this.sellerId,
      };
    }
  }
  