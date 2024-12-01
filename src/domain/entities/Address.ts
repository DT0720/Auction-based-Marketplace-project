import { fromJSON } from "postcss";

export class Address{
    constructor(
        public id: number,
        public user_id: number,
        public flat_no: string,
        public house_no: string,
        public house_name: string,
        public road_no: string,
        public sector: number,
        public area: string,
        public city: string,
    ){}

    static fromJSON(data: any): Address {
        return new Address(
            data.id,
            data.user_id,
            data.flat_no,
            data.house_no,
            data.house_name,
            data.road_no,
            data.sector,
            data.area,
            data.city,
        );
    }

    toJson(): any {
        return{
            id: this.id,
            user_id: this.user_id,
            flat_no: this.flat_no,
            house_no: this.house_no,
            house_name: this.house_name,
            road: this.road_no,
            sector: this.sector,
            area: this.area,
            city: this.city,
        }
    };
}

