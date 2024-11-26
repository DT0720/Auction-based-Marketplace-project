import { Product } from "../entities/Product";

export interface ProductForSaleResponse {
    product: Product;
    quantity: number;
}