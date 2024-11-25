export class SellerInventory{
    constructor(
        public id: number,
        public seller_id: number,
        public product_id: number,
        public quantity: number,
        public quantity_for_sale: number,
    ){}
    static fromJson(data : any) : SellerInventory{
        return new SellerInventory(
            data.id,
            data.seller_id,
            data.product_id,
            data.quantity,
            data.quantity_for_sale,
        );
    }
    toJson() : any{
        return {
            id: this.id,
            seller_id: this.seller_id,
            product_id: this.product_id,
            quantity: this.quantity,
            quantity_for_sale: this.quantity_for_sale,
        }
    }
}