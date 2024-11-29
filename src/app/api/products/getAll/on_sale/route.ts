import { NextResponse } from 'next/server';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';
import { PhotoTypeEnum } from '@/domain/enums/PhotoTypeEnum';
import { SellerInventoryRepository } from '@/infrastructure/repositories/SellerInventoryRepository';
import { ISellerInvertoryRepository } from '@/application/repositories/ISellerInventoryRepository';
import { IFileStorageService } from '@/application/services/IFileStorageService';

const sellerInventoryRepository: ISellerInvertoryRepository = new SellerInventoryRepository();
const imageStorageService: IFileStorageService = new ImageStorageService();

export async function GET(req: Request) {
  try {
    const productList = await sellerInventoryRepository.findAllForSale();

    const updatedProducts = await Promise.all(
      productList.map(async (product) => {
        if (product.photo) {
          console.log("Before: " + product.photo );
          product.photo = await imageStorageService.getFileUrl(product.photo);
          console.log("After: " + product.photo);
        }else{
          product.photo = ImageStorageService.productPlaceholderImage;
        }
        return product;
      })
    );

    if (updatedProducts.length === 0) {
      return NextResponse.json(
        { message: "No products found", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        message: "Products found",
        data: updatedProducts
      },
      { status: 200 }
    );

  } catch (error: any) {
      return NextResponse.json(
        { message: error.message, data: [] },
        { status: 400 }
      );
  }
}

