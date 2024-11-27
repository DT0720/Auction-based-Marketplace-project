import { IFileStorageService } from "@/application/services/IFileStorageService";
import { Auction } from "@/domain/entities/Auction";
import { Product } from "@/domain/entities/Product";
import { SellerInventory } from "@/domain/entities/SellerInventory";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const fileStorageService : IFileStorageService = new ImageStorageService();

const endpoint = "/api/products/addProduct";

/**
 * Adds a new product to the inventory, uploads product images, and optionally adds it to the seller's inventory.
 * 
 * @param {any} data - The product data.
 * @param {File | null} image - The product image file.
 * @param {number} [buyer_seller_id] - The ID of the buyer/seller.
 * @param {number} [quantity_for_sale=0] - The number of items to put on sale.
 * @returns {Promise<Product | null>} - The created product object or null.
 * @throws {Error} - Throws an error if product creation or inventory update fails.
 */

async function addProduct(data: any, image: File | null, buyer_seller_id?: number, quantity_for_sale: number = 0): Promise<Product | null> {

   const response = await NetworkUtils.postRequest<ApiResponse<Product>>(endpoint, data);

   if (!response) {
       throw new Error("Product creation failed.");
   }

   const inventoryData = await addProductToSellerInventory(response?.data, buyer_seller_id, quantity_for_sale);

   if (!inventoryData) {
       throw new Error("Product creation failed.");
   }

   await handleImageUpload(response?.data?.id ?? 0, image);
   
   return response?.data ?? null;
}

/**
 * Adds a product to the seller's inventory.
 * 
 * @param {Product} [product] - The product to be added.
 * @param {number} [buyer_seller_id] - The ID of the buyer/seller.
 * @param {number} [quantity_for_sale=0] - The number of items to put on sale.
 * @returns {Promise<SellerInventory | null>} - The updated seller inventory object or null.
 * @throws {Error} - Throws an error if inventory update fails.
 */
async function addProductToSellerInventory(product?: Product, buyer_seller_id?: number, quantity_for_sale: number = 0): Promise<SellerInventory | null> {
  
      const data = {
        seller_id: buyer_seller_id,
        product_id: product?.id,
        quantity: product?.stock,
        quantity_for_sale: quantity_for_sale,
      }

      const response = await NetworkUtils.postRequest<ApiResponse<SellerInventory>>(endpoint + "/to_seller_inventory", data);
  
      if (!response) {
          throw new Error("Product creation failed.");
      }
  
      return response?.data ?? null;

  }


/**
 * Adds a product to be available for sale.
 * 
 * @param {any} data - The product data.
 * @param {number} [buyer_seller_id] - The ID of the buyer/seller.
 * @returns {Promise<SellerInventory | null>} - The updated seller inventory object or null.
 * @throws {Error} - Throws an error if the product cannot be added for sale.
 */
async function addProductOnSale(data: any, buyer_seller_id?: number): Promise<SellerInventory | null> {

    if(data.quantity_for_sale === 0) {
        throw new Error("Please add items to sell.");
    }

    const body = {
      seller_id: buyer_seller_id,
      product_id: data?.product_id ? parseInt(data?.product_id) : 0,
      quantity: data?.stock,
      quantity_for_sale: data.quantity_for_sale,
    }

    const response = await NetworkUtils.postRequest<ApiResponse<SellerInventory>>(endpoint + "/on_sale", body);

    if (!response) {
        throw new Error("Failed to add product on sale.");
    }

    return response?.data ?? null;
}


/**
 * Puts a product up for auction.
 * 
 * @param {any} data - The product data for auction.
 * @returns {Promise<Auction | null>} - The created auction object or null.
 * @throws {Error} - Throws an error if the auction cannot be created.
 */
async function addProductOnAuction(data: any): Promise<Auction | null> {

  const body = {
    product_id: data.product_id,
    seller_id: data.seller_id,
    current_price: data.current_price,
    desired_price: data.desired_price,
    quantity_for_sale: data.quantity_for_sale,
    status: data.status,
    createdAt: Date.now(),
  }    

  const response = await NetworkUtils.postRequest<ApiResponse<Auction>>(endpoint + "/on_auction", body);

  if (!response) {
      throw new Error("Product creation failed.");
  }

  return response?.data ?? null;
}


/**
 * Handles image upload for a product and updates the product with the uploaded image URL.
 * 
 * @param {number} _id - The ID of the product.
 * @param {File | null} image - The image file to be uploaded.
 * @returns {Promise<void>} - Resolves once the image is uploaded and the product is updated.
 * @throws {Error} - Throws an error if image upload fails.
 */
const handleImageUpload = async (_id: number, image : File | null): Promise<void> => {

    if (image) {
      const fileName = image?.name ?? "default.jpg";
      const path = fileName;
      const photoUrl = await fileStorageService.uploadFile(image ?? undefined, path);

      // Update the user profile with the image URL
      await NetworkUtils.postRequest('/api/products/update-product', {
        id: _id,
        photo: photoUrl,
      });
    }
  }



export { addProduct, addProductToSellerInventory, addProductOnSale, addProductOnAuction };