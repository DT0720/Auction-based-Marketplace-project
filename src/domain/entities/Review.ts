import { Product } from "./Product";
import { User } from "./User";

export class Review {
    constructor(
        public review_id: number,
        public review_content: string,
        public user_id: number,
        public product_id: number,
        public rating: number,
    ) {}

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