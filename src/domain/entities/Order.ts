/**
 * @class Order
 * @classdesc Represents an order placed by a buyer
 */

export class Order {
  /**
   * @constructor
   * @param {number} id - The unique identifier of the order
   * @param {number} buyerId - The ID of the buyer who placed the order
   * @param {number | null} offerId - The ID of the offer applied to the order, if any
   * @param {string | null} status - The status of the order
   * @param {number | null} totalAmount - The total amount of the order
   */
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
