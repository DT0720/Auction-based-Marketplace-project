// src/app/api/products/[id]/route.ts

import { ISellerInvertoryRepository } from '@/application/repositories/ISellerInventoryRepository';
import { IFileStorageService } from '@/application/services/IFileStorageService';
import { PhotoTypeEnum } from '@/domain/enums/PhotoTypeEnum';
import { SellerInventoryRepository } from '@/infrastructure/repositories/SellerInventoryRepository';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const imageStorageService: IFileStorageService = new ImageStorageService();

    const sellerInventoryRepository : ISellerInvertoryRepository = new SellerInventoryRepository();

    try {
        const { id } = await context.params;

        const sellerId = parseInt(id, 10);

        if (isNaN(sellerId)) {
          return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
        }

        const product = await sellerInventoryRepository.findBySellerId(sellerId);

        console.log(product);

        if (!product) {
            return NextResponse.json({ message: 'Product list not found' }, { status: 404 });
        }

        product.forEach(async (product) => {
            if (product.photo) {
                product.photo = await imageStorageService.getFileUrl(product.photo,PhotoTypeEnum.PRODUCT);
                if (!product.photo) {
                  product.photo = ImageStorageService.productPlaceholderImage;
                }
            }
        });

        return NextResponse.json({ message: 'Product list found successfully', data: product }, { status: 200 });
    } catch (error: any) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Error processing request', data: null }, { status: 500 });
    }
}
