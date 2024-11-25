export class SellerInventory{
    constructor(
        public id: number,
        public seller_id: number,
        public product_id: number,
    ){}
    static fromJson(data : any) : SellerInventory{
        return new SellerInventory(
            data.id,
            data.seller_id,
            data.product_id,
        );
    }
    toJson() : any{
        return {
            id: this.id,
            seller_id: this.seller_id,
            product_id: this.product_id,
        }
    }
}