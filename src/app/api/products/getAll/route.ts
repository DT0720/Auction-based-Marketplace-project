import { NextResponse } from 'next/server';
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';

const productRepository = new ProductRepository();
const imageStorageService = new ImageStorageService();

export async function GET(req: Request) {
  try {

    const productList = await productRepository.findAllProducts(); 

    const updatedProducts = await Promise.all(
      productList.map(async (product) => {
        if (product.photo) {
          product.photo = await imageStorageService.getFileUrl(product.photo);
          if (!product.photo) {
            product.photo = ImageStorageService.productPlaceholderImage;
          }
        }
        return product;
      })
    );

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

