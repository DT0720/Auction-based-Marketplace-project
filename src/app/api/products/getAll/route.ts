import { NextResponse } from 'next/server';
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';
import { PhotoTypeEnum } from '@/domain/enums/PhotoTypeEnum';

const productRepository = new ProductRepository();
const imageStorageService = new ImageStorageService();


/**
 * Handles GET requests to retrieve all products
 * @async
 * @function GET
 * @param {Request} req - The request object
 * @returns {Promise<Response>} - The response object containing the list of products or an error message
 */
export async function GET(req: Request) {
  try {

    const productList = await productRepository.findAllProducts(); 

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

