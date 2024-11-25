import { ProductTypeEnum } from "../enums/ProductTypeEnum";

export class Product {
    constructor(
      public id: number,
      public productName: string | null,
      public stock: number | null,
      public pricePerUnit: number | null,
      public category: string | null,
      public description: string | null = null,
      public photo: string | null
    ) {}
    
    updatePhoto(photoData: string) {
      this.photo = photoData;
    }

    static fromJson(data: any): Product {
      return new Product(
        data.id,
        data.product_name,
        data.stock,
        data.price_per_unit,
        data.category,
        data.description,
        data.photo
      );
    }

    toJson(): any {
      return {
        id: this.id,
        product_name: this.productName,
        stock: this.stock,
        price_per_unit: this.pricePerUnit,
        category: this.category,
        description: this.description,
        photo: this.photo,
      }
    };
    
}
  