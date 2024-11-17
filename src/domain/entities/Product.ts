export class Product {
    constructor(
      public id: number,
      public productName: string,
      public stock: number,
      public pricePerUnit: number,
      public photo: Buffer | null, // Nullable blob to hold binary data
    ) {}
  
    // Domain methods related to Product
    reduceStock(quantity: number) {
      if (this.stock < quantity) {
        throw new Error("Insufficient stock available");
      }
      this.stock -= quantity;
    }
  
    updatePhoto(photoData: Buffer | null) {
      this.photo = photoData;
    }
}
  