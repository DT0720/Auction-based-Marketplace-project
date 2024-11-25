export class SellerInventory{
    constructor(
        public id: number,
        public seller_id: number,
        public product_id: number,
        public quantity: number,
        public price: number,
        public discount: number,
        public status: string,
        public created_at: Date,
        public updated_at: Date,
    ){}
    static fromJson(data : any) : SellerInventory{
        return new SellerInventory(
            data.id,
            data.seller_id,
            data.product_id,
            data.quantity,
            data.price,
            data.discount,
            data.status,
            data.created_at,
            data.updated_at,
        );
    }
}