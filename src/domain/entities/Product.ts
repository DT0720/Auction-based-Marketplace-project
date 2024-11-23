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
}
  