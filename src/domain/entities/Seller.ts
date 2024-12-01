/**
 * @class Seller
 * @classdesc Represents a seller
 */

export class Seller{
    /**
     * @constructor
     * @param {number} id - The unique identifier of the seller
     * @param {number} user_id - The ID of the user associated with the seller
     */
    constructor(
        public id: number,
        public user_id: number,
    ){}
    /**
     * Creates a Seller instance from a JSON object
     * @param {any} data - The JSON object containing seller data
     * @returns {Seller} - The Seller instance created from the JSON data
     */

    static fromJson(data: any): Seller{
        return new Seller(data.id, data.user_id);
    }
}