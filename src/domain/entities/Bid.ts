
export class Bid{
    constructor(
        public id: number,
        public auction_id: number,
        public price: number,
        public buyer_id: number,
        public created_at: Date,
    ){}
    
    static fromJson(data: any): Bid {
        return new Bid(
            data.id,
            data.auction_id,
            data.price,
            data.buyer_id,
            data.created_at
        );
    }

    toJson(): any {
        return {
            id: this.id,
            auction_id: this.auction_id,
            price: this.price,
            buyer_id: this.buyer_id,
            created_at: this.created_at
        }
    }
}
  