import { User } from "../entities/User";
/**
 * @interface LoginResponse
 * @description Represents the response received after a successful login
 * @property {User} user - The user object containing user details
 * @property {number} buyer_seller_id - The ID of the buyer or seller
 * @property {number} credit - The credit amount associated with the user
 * @property {string} token - The authentication token
 */
export interface LoginResponse {
    user: User;
    buyer_seller_id: number;
    credit: number,
    token: string;
}