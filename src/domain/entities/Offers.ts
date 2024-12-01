/**
 * @class Offers
 * @classdesc Represents an offer with a discount
 */

export class Offers {
    /**
     * @constructor
     * @param {number} id - The unique identifier of the offer
     * @param {string} type - The type of the offer
     * @param {number} discountAmount - The discount amount of the offer
     */

  constructor(
    public id: number,
    public type: string,
    public discountAmount: number
  ) { }

  /**
   * Creates an `Offers` instance from a raw JSON object.
   * @param {any} data - The raw JSON data.
   * @returns {Offers} The created Offers instance.
   */
  static fromJson(data: any): Offers {
    return new Offers(data.id, data.type, data.discount_amount);
  }

  /**
   * Converts the `Offers` instance to a plain JSON object.
   * @returns {any} The JSON representation of the Offers instance.
   */
  toJson(): any {
    return {
      id: this.id,
      type: this.type,
      discount_amount: this.discountAmount,
    };
  }
}
