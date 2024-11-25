import { IFileStorageService } from "@/application/services/IFileStorageService";
import { Product } from "@/domain/entities/Product";
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

const handleImageUpload = async (_id: number, image : File | null) => {

    if (image) {
      const fileName = image?.name ?? "default.jpg";
      const path = `uploads/${fileName}`;
      const photoUrl = await fileStorageService.uploadFile(image ?? undefined, path);

      // Update the user profile with the image URL
      await NetworkUtils.postRequest('/api/products/update-product', {
        id: _id,
        photo: photoUrl,
      });
    }
  }

export default addProduct;