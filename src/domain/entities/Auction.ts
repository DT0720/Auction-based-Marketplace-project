export class Auction{
    constructor(
        public id: number,
        public productId: number,
        public sellerId: number,
        public buyItNowPrice: number,
        public minimumPrice: number,
        public status: boolean,
        public startTime: Date,
        public endTime: Date,
    ){}

    static fromJson(data: any): Auction {
        return new Auction(
            data.id,
            data.product_id,
            data.seller_id,
            data.buy_it_now_price,
            data.minimum_price,
            data.status,
            data.start_time,
            data.end_time
        );
    }

    toJson(): any {
        return {
            id: this.id,
            product_id: this.productId,
            seller_id: this.sellerId,
            buy_it_now_price: this.buyItNowPrice,
            minimum_price: this.minimumPrice,
            status: this.status,
            start_time: this.startTime,
            end_time: this.endTime
        }
    }
}