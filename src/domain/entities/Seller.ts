export class Seller{
    constructor(
        public id: number,
        public user_id: number,
    ){}

    static fromJson(data: any): Seller{
        return new Seller(data.id, data.user_id);
    }
}