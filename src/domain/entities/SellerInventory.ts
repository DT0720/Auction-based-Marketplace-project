/**
 * @class SellerInventory
 * @classdesc Represents the inventory of a seller
 */

export class SellerInventory{
    /**
     * @constructor
     * @param {number} id - The unique identifier of the inventory item
     * @param {number} seller_id - The ID of the seller
     * @param {number} product_id - The ID of the product
     * @param {number} quantity - The quantity of the product in the inventory
     * @param {number} quantity_for_sale - The quantity of the product available for sale
     */
    constructor(
        public id: number,
        public seller_id: number,
        public product_id: number,
        public quantity: number,
        public quantity_for_sale: number,
    ){}
     /**
     * Creates a `SellerInventory` instance from a JSON object
     * @param {any} data - The JSON object containing inventory data
     * @returns {SellerInventory} - The SellerInventory instance created from the JSON data
     */
    static fromJson(data : any) : SellerInventory{
        return new SellerInventory(
            data.id,
            data.seller_id,
            data.product_id,
            data.quantity,
            data.quantity_for_sale,
        );
    }
    /**
     * Converts the `SellerInventory` instance to a plain JSON object
     * @returns {any} - The JSON representation of the SellerInventory instance
     */
    toJson() : any{
        return {
            id: this.id,
            seller_id: this.seller_id,
            product_id: this.product_id,
            quantity: this.quantity,
            quantity_for_sale: this.quantity_for_sale,
        }
    }
}