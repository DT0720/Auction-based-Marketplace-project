import { ProductTypeEnum } from "../enums/ProductTypeEnum";

/**
 * @class Product
 * @classdesc Represents a product in the inventory
 */
export class Product {
  /**
     * @constructor
     * @param {number} id - The unique identifier of the product
     * @param {string | null} productName - The name of the product
     * @param {number | null} stock - The stock quantity of the product
     * @param {number | null} pricePerUnit - The price per unit of the product
     * @param {string | null} category - The category of the product
     * @param {string | null} description - The description of the product
     * @param {string | null} photo - The photo URL of the product
     */
    constructor(
      public id: number,
      public productName: string | null,
      public stock: number | null,
      public pricePerUnit: number | null,
      public category: string | null,
      public description: string | null = null,
      public photo: string | null
    ) {}
     /**
     * Updates the photo of the product
     * @param {string} photoData - The new photo data
     */
    
    updatePhoto(photoData: string) {
      this.photo = photoData;
    }
    /**
     * Creates a `Product` instance from a raw JSON object.
     * @param {any} data - The raw JSON data.
     * @returns {Product} The created Product instance.
     */

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
  