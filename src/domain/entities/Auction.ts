/**
 * @class Auction
 * @classdesc Represents an auction for a product
 */
export class Auction{
    /**
     * @constructor
     * @param {number} id - The unique identifier of the auction
     * @param {number} productId - The ID of the product being auctioned
     * @param {number} sellerId - The ID of the seller
     * @param {number} buyItNowPrice - The "Buy It Now" price of the auction
     * @param {number} minimumPrice - The minimum price of the auction
     * @param {boolean} status - The status of the auction (active or inactive)
     * @param {Date} startTime - The start time of the auction
     * @param {Date} endTime - The end time of the auction
     */
    constructor(
        public id: number,
        public productId: number,
        public sellerId: number,
        public buyItNowPrice: number,
        public minimumPrice: number,
        public status: boolean,
        public startTime: Date,
        public endTime: Date,
    ){}
      /**
     * Creates an Auction instance from a JSON object
     * @param {any} data - The JSON object containing auction data
     * @returns {Auction} - The Auction instance created from the JSON data
     */

    static fromJson(data: any): Auction {
        return new Auction(
            data.id,
            data.product_id,
            data.seller_id,
            data.buy_it_now_price,
            data.minimum_price,
            data.status,
            data.start_time,
            data.end_time
        );
    }

    toJson(): any {
        return {
            id: this.id,
            product_id: this.productId,
            seller_id: this.sellerId,
            buy_it_now_price: this.buyItNowPrice,
            minimum_price: this.minimumPrice,
            status: this.status,
            start_time: this.startTime,
            end_time: this.endTime
        }
    }
}