import { IFileStorageService } from "@/application/services/IFileStorageService";
import { Product } from "@/domain/entities/Product";
import { SellerInventory } from "@/domain/entities/SellerInventory";
import { PhotoTypeEnum } from "@/domain/enums/PhotoTypeEnum";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const fileStorageService : IFileStorageService = new ImageStorageService();

const endpoint = "/api/products/addProduct";

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

const handleImageUpload = async (_id: number, image : File | null) => {

    if (image) {
      const fileName = image?.name ?? "default.jpg";
      const path = fileName;
      const photoUrl = await fileStorageService.uploadFile(image ?? undefined, path, PhotoTypeEnum.PRODUCT);

      // Update the user profile with the image URL
      await NetworkUtils.postRequest('/api/products/update-product', {
        id: _id,
        photo: photoUrl,
      });
    }
  }



export { addProduct, addProductToSellerInventory, addProductOnSale };