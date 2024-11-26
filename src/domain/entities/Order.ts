export class Orders {
    constructor(
      public id: number,
      public buyer_id: number,
      public offer_id: number,
      public status: string,
      public seller_id: number,
    ) {}

    static fromJson(data: any): Orders {
      return new Orders(
        data.id,
        data.buyer_id,
        data.offer_id,
        data.status,
        data.seller_id,
      );
    }

    toJson(): any {
      return {
        id: this.id,
        buyer_id: this.buyer_id,
        offer_id: this.offer_id,
        status: this.status,
        seller_id: this.seller_id,
      }
    };
    
}
  