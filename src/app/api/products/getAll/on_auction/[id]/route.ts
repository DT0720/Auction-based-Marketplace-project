// src/app/api/products/[id]/route.ts

import { IAuctionRepository } from '@/application/repositories/IAuctionRepository';
import { IFileStorageService } from '@/application/services/IFileStorageService';
import { AuctionRepository } from '@/infrastructure/repositories/AuctionRepository';
import { ImageStorageService } from '@/infrastructure/services/ImageStorageService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const imageStorageService: IFileStorageService = new ImageStorageService();
    const auctionRepository : IAuctionRepository = new AuctionRepository();

    try {
        const { id } = await context.params;
        const productId = parseInt(id, 10);

        if (isNaN(productId)) {
          return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
        }

        const productAuction = await auctionRepository.findActiveAuctionsById(productId);

        if (!productAuction) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const { product, auction } = productAuction;

        if (product.photo) {
            console.log("Before: " + product.photo);
            product.photo = await imageStorageService.getFileUrl(product.photo);
            console.log("After: " + product.photo);
        } else {
            product.photo = ImageStorageService.productPlaceholderImage;
        }

        console.log("Get By Id photo: " + product.photo);

        return NextResponse.json({ message: 'Product found successfully', data: { product, auction } }, { status: 200 });
    } catch (error: any) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Error processing request', data: null }, { status: 500 });
    }
}
