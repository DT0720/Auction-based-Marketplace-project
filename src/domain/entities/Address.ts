import { fromJSON } from "postcss";

/**
 * @class Address
 * @classdesc Represents an address associated with a user
 */
export class Address{
    /**
     * @constructor
     * @param {number} id - The unique identifier of the address
     * @param {number} user_id - The ID of the user associated with the address
     * @param {string} flat_no - The flat number of the address
     * @param {string} house_no - The house number of the address
     * @param {string} house_name - The house name of the address
     * @param {string} road_no - The road number of the address
     * @param {number} sector - The sector number of the address
     * @param {string} area - The area of the address
     * @param {string} city - The city of the address
     */
    constructor(
        public id: number,
        public user_id: number,
        public flat_no: string,
        public house_no: string,
        public house_name: string,
        public road_no: string,
        public sector: number,
        public area: string,
        public city: string,
    ){}
    /**
     * Creates an Address instance from a JSON object
     * @param {any} data - The JSON object containing address data
     * @returns {Address} - The Address instance created from the JSON data
     */

    static fromJSON(data: any): Address {
        return new Address(
            data.id,
            data.user_id,
            data.flat_no,
            data.house_no,
            data.house_name,
            data.road_no,
            data.sector,
            data.area,
            data.city,
        );
    }

    toJson(): any {
        return{
            id: this.id,
            user_id: this.user_id,
            flat_no: this.flat_no,
            house_no: this.house_no,
            house_name: this.house_name,
            road: this.road_no,
            sector: this.sector,
            area: this.area,
            city: this.city,
        }
    };
}

