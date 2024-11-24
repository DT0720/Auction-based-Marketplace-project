import { ProductTypeEnum } from "../enums/ProductTypeEnum";

export class Product {
    constructor(
      public id: number,
      public productName: string,
      public stock: number,
      public pricePerUnit: number,
      public category: string,
      public photo: string | null
    ) {}
  
    // Domain methods related to Product
    reduceStock(quantity: number) {
      if (this.stock < quantity) {
        throw new Error("Insufficient stock available");
      }
      this.stock -= quantity;
    }
  
    updatePhoto(photoData: string) {
      this.photo = photoData;
    }

    static fromJson(data: any): Product {
      return new Product(
        data.id,
        data.product_name,
        data.stock,
        data.price_per_unit !== undefined && data.price_per_unit !== null
        ? parseFloat(data.price_per_unit.toString())
        : 0,
        data.category ?? ProductTypeEnum.NO_CATEGORY,
        data.photo
      );
    }
}
  