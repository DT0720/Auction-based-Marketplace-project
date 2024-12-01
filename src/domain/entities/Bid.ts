/**
 * @class Bid
 * @classdesc Represents a bid in an auction
 */
export class Bid{
    /**
     * @constructor
     * @param {number} id - The unique identifier of the bid
     * @param {number} auction_id - The ID of the auction the bid is placed on
     * @param {number} price - The price of the bid
     * @param {number} buyer_id - The ID of the buyer placing the bid
     * @param {Date} created_at - The date and time when the bid was created
     */
    constructor(
        public id: number,
        public auction_id: number,
        public price: number,
        public buyer_id: number,
        public created_at: Date,
    ){}
    /**
     * Creates a Bid instance from a JSON object
     * @param {any} data - The JSON object containing bid data
     * @returns {Bid} - The Bid instance created from the JSON data
     */
    
    static fromJson(data: any): Bid {
        return new Bid(
            data.id,
            data.auction_id,
            data.price,
            data.buyer_id,
            data.created_at
        );
    }
     /**
     * Converts the Bid instance to a JSON object
     * @returns {any} - The JSON representation of the Bid instance
     */

    toJson(): any {
        return {
            id: this.id,
            auction_id: this.auction_id,
            price: this.price,
            buyer_id: this.buyer_id,
            created_at: this.created_at
        }
    }
}
  