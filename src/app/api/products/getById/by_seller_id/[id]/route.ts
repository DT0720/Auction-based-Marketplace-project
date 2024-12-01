// src/app/api/products/[id]/route.ts
import { ISellerInvertoryRepository } from '@/application/repositories/ISellerInventoryRepository';
import { IFileStorageService } from '@/application/services/IFileStorageService';
import { SellerInventoryRepository } from '@/infrastructure/repositories/SellerInventoryRepository';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';
import { NextRequest, NextResponse } from 'next/server';


/**
 * Handles GET requests to retrieve products by seller ID
 * @async
 * @function GET
 * @param {NextRequest} req - The request object
 * @param {Object} context - The context object containing route parameters
 * @param {Promise<{ id: string }>} context.params - The route parameters containing the seller ID
 * @returns {Promise<NextResponse>} - The response object containing the product details or an error message
 */

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const imageStorageService: IFileStorageService = new ImageStorageService();

    const sellerInventoryRepository : ISellerInvertoryRepository = new SellerInventoryRepository();

    try {
        const { id } = await context.params;

        const sellerId = parseInt(id, 10);

        if (isNaN(sellerId)) {
          return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
        }

        const products = await sellerInventoryRepository.findBySellerId(sellerId);

        if (!products) {
            return NextResponse.json({ message: 'Product list not found' }, { status: 404 });
        }

        const updatedProducts = await Promise.all(products.map(async (product) => {
            if (product.photo) {
              product.photo = await imageStorageService.getFileUrl(product.photo);
            }
            if (!product.photo) {
              product.photo = ImageStorageService.productPlaceholderImage;
            }
            return product;
          }));

        return NextResponse.json({ message: 'Product list found successfully', data: updatedProducts }, { status: 200 });
    } catch (error: any) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Error processing request', data: null }, { status: 500 });
    }
}
