export class Auction{
    constructor(
        public id: number,
        public productId: number,
        public sellerId: number,
        public currentPrice: number,
        public desiredPrice: number,
        public status: boolean,
        public createdAt: Date,
    ){}
}