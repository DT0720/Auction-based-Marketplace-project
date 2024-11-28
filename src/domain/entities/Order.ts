export class Order {
    constructor(
      public id: number,
      public buyerId: string | null,
      public sellerId: string | null,
      public productId: number | null,
      public quantity: number | null,
      public totalPrice: number | null,
      public status: string | null = "Pending",
      public createdAt: Date | null = new Date(),
      public updatedAt: Date | null = new Date()
    ) {}
  
    /**
     * Updates the status of the order.
     *
     * @param {string} newStatus - The new status to set.
     */
    updateStatus(newStatus: string): void {
      this.status = newStatus;
    }
  
    /**
     * Converts a plain JSON object into an `Order` entity.
     *
     * @param {any} data - The incoming JSON data.
     * @returns {Order} - The `Order` instance created from the data.
     */
    static fromJson(data: any): Order {
      if (!data) {
        throw new Error("Invalid data for Order creation.");
      }
  
      return new Order(
        data.id,
        data.buyer_id,
        data.seller_id,
        data.product_id,
        data.quantity,
        data.total_price,
        data.status || "Pending",
        data.created_at ? new Date(data.created_at) : null,
        data.updated_at ? new Date(data.updated_at) : null
      );
    }
  
    /**
     * Converts the `Order` entity into a plain JSON object for serialization.
     *
     * @returns {any} - The JSON representation of the `Order` entity.
     */
    toJson(): any {
      return {
        id: this.id,
        buyer_id: this.buyerId,
        seller_id: this.sellerId,
        product_id: this.productId,
        quantity: this.quantity,
        total_price: this.totalPrice,
        status: this.status,
        created_at: this.createdAt?.toISOString(),
        updated_at: this.updatedAt?.toISOString(),
      };
    }
  }
  