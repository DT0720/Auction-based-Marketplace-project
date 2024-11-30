export class Order {
  constructor(
    public id: number,
    public buyerId: number,
    public offerId: number | null,
    public status: string | null,
    public totalAmount: number | null
  ) {}

  /**
   * Creates an `Order` instance from a raw JSON object.
   * @param {any} data - The raw JSON data.
   * @returns {Order} The created Order instance.
   */
  static fromJson(data: any): Order {
    return new Order(
      data.id,
      data.buyer_id,
      data.offer_id,
      data.status,
      data.total_amount
    );
  }

  /**
   * Converts the `Order` instance to a plain JSON object.
   * @returns {any} The JSON representation of the Order instance.
   */
  toJson(): any {
    return {
      id: this.id,
      buyer_id: this.buyerId,
      offer_id: this.offerId,
      status: this.status,
      total_amount: this.totalAmount,
    };
  }
}
