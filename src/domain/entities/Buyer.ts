export class Buyer{
    constructor(
        public id: number,
        public user_id: number,
    ){}

    static fromJson(data: any): Buyer{
        console.log("Buyer data is " + data);
        return new Buyer(data.id, data.user_id);
    }
}