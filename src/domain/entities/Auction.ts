export class Auction{
    constructor(
        public id: number,
        public productId: number,
        public sellerId: number,
        public currentPrice: number,
        public desiredPrice: number,
        public quantity_for_sale: number,
        public status: boolean,
        public createdAt: Date,
    ){}

    static fromJson(data: any): Auction {
        return new Auction(
            data.id,
            data.product_id,
            data.seller_id,
            data.current_price,
            data.desired_price,
            data.quantity_for_sale,
            data.status,
            data.created_at
        );
    }

    toJson(): any {
        return {
            id: this.id,
            product_id: this.productId,
            seller_id: this.sellerId,
            current_price: this.currentPrice,
            desired_price: this.desiredPrice,
            quantity_for_sale: this.quantity_for_sale,
            status: this.status,
            created_at: this.createdAt
        }
    }
}