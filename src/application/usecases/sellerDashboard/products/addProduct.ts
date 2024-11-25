import { IFileStorageService } from "@/application/services/IFileStorageService";
import { Product } from "@/domain/entities/Product";
import { SellerInventory } from "@/domain/entities/SellerInventory";
import { PhotoTypeEnum } from "@/domain/enums/PhotoTypeEnum";
import { ImageStorageService } from "@/infrastructure/services/ImageStorageService";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const fileStorageService : IFileStorageService = new ImageStorageService();

const endpoint = "/api/products/addProduct";

async function addProduct(data: any, image: File | null): Promise<Product | null> {

   const response = await NetworkUtils.postRequest<ApiResponse<Product>>(endpoint, data);

   if (!response) {
       throw new Error("Product creation failed.");
   }

   await handleImageUpload(response?.data?.id ?? 0, image);
   
   return response?.data ?? null;
}

async function addProductToSellerInventory(product_id?: number, buyer_seller_id?: number): Promise<SellerInventory | null> {
  
      const data = {
        product_id: product_id,
        seller_id: buyer_seller_id
      }

      const response = await NetworkUtils.postRequest<ApiResponse<SellerInventory>>(endpoint + "/to_seller_inventory", data);
  
      if (!response) {
          throw new Error("Product creation failed.");
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



export { addProduct, addProductToSellerInventory };