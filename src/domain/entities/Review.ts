import { Product } from "./Product";
import { User } from "./User";

/**
 * @class Review
 * @classdesc Represents a product review
 */
export class Review {
    /**
     * @constructor
     * @param {number} review_id - The unique identifier of the review
     * @param {string} review_content - The content of the review
     * @param {number} user_id - The ID of the user who wrote the review
     * @param {number} product_id - The ID of the product being reviewed
     * @param {number} rating - The rating given in the review
     */
    constructor(
        public review_id: number,
        public review_content: string,
        public user_id: number,
        public product_id: number,
        public rating: number,
    ) {}
    /**
     * Creates a `Review` instance from a JSON object
     * @param {any} data - The JSON object containing review data
     * @returns {Review} - The Review instance created from the JSON data
     */


    static fromJson(data: any): Review {
        return new Review(
            data.review_id,
            data.review_content,
            data.user_id,
            data.product_id,
            data.rating,
        );
    }
}