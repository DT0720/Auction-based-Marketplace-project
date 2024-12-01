import { Product } from "../entities/Product";
/**
 * @interface ProductForSaleResponse
 * @description Represents the response containing product details and quantity for sale
 * @property {Product} product - The product object containing product details
 * @property {number} quantity - The quantity of the product available for sale
 */
export interface ProductForSaleResponse {
    product: Product;
    quantity: number;
}