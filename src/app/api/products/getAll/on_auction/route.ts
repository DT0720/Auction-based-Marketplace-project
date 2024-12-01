import { NextResponse } from 'next/server';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';
import { IFileStorageService } from '@/application/services/IFileStorageService';
import { IAuctionRepository } from '@/application/repositories/IAuctionRepository';
import { AuctionRepository } from '@/infrastructure/repositories/AuctionRepository';

const auctionRepository: IAuctionRepository = new AuctionRepository();
const imageStorageService: IFileStorageService = new ImageStorageService();


/**
 * Handles GET requests to retrieve all products on auction
 * @async
 * @function GET
 * @param {Request} req - The request object
 * @returns {Promise<Response>} - The response object containing the list of products on auction or an error message
 */
export async function GET(req: Request) {
  try {
    const productList = await auctionRepository.findAllProductsOnAuction();

    const updatedProducts = await Promise.all(
      productList.map(async ({ product, auction }) => {
        if (product.photo) {
          console.log("Before: " + product.photo);
          product.photo = await imageStorageService.getFileUrl(product.photo);
          console.log("After: " + product.photo);
        } else {
          product.photo = ImageStorageService.productPlaceholderImage;
        }
        return { product, auction };
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
