/**
 * @class Buyer
 * @classdesc Represents a buyer
 */
export class Buyer{
    /**
     * @constructor
     * @param {number} id - The unique identifier of the buyer
     * @param {number} user_id - The ID of the user associated with the buyer
     */
    constructor(
        public id: number,
        public user_id: number,
    ){}
    
    /**
     * Creates a Buyer instance from a JSON object
     * @param {any} data - The JSON object containing buyer data
     * @returns {Buyer} - The Buyer instance created from the JSON data
     */

    static fromJson(data: any): Buyer{
        console.log("Buyer data is " + data);
        return new Buyer(data.id, data.user_id);
    }
}