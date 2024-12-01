// src/app/api/products/[id]/route.ts

import { IProductRepository } from '@/application/repositories/IProductRepository';
import { IFileStorageService } from '@/application/services/IFileStorageService';
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';
import { NextRequest, NextResponse } from 'next/server';


/**
 * Handles GET requests to retrieve a product by its ID
 * @async
 * @function GET
 * @param {NextRequest} req - The request object
 * @param {Object} context - The context object containing route parameters
 * @param {Promise<{ id: string }>} context.params - The route parameters containing the product ID
 * @returns {Promise<NextResponse>} - The response object containing the product details or an error message
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const imageStorageService: IFileStorageService = new ImageStorageService();

    const productRepository : IProductRepository = new ProductRepository();

    try {
        const { id } = await context.params;

        const productId = parseInt(id, 10);

        if (isNaN(productId)) {
          return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
        }

        const product = await productRepository.findById(productId);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        if (product.photo) {
            product.photo = await imageStorageService.getFileUrl(product.photo);
            if (!product.photo) {
              product.photo = ImageStorageService.productPlaceholderImage;
            }
        }

        console.log("Get By Id photo: " + product.photo);

        return NextResponse.json({ message: 'Product found successfully', data: product }, { status: 200 });
    } catch (error: any) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Error processing request', data: null }, { status: 500 });
    }
}
