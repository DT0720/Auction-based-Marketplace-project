// src/app/api/products/[id]/route.ts

import { IAuctionRepository } from '@/application/repositories/IAuctionRepository';
import { AuctionRepository } from '@/infrastructure/repositories/AuctionRepository';
import { NextRequest, NextResponse } from 'next/server';


/**
 * Handles GET requests to retrieve active auctions for a product by its ID
 * @async
 * @function GET
 * @param {NextRequest} req - The request object
 * @param {Object} context - The context object containing route parameters
 * @param {Promise<{ id: string }>} context.params - The route parameters containing the product ID
 * @returns {Promise<NextResponse>} - The response object containing the auction details or an error message
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const auctionRepository : IAuctionRepository = new AuctionRepository();

    try {
        const { id } = await context.params;
        const productId = parseInt(id, 10);

        if (isNaN(productId)) {
          return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
        }

        const productAuction = await auctionRepository.findProductByIdWithDetails(productId);

        if (!productAuction) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const { reviews, bids  } = productAuction;

        return NextResponse.json({ message: 'Product found successfully', data: { reviews, bids } }, { status: 200 });
    } catch (error: any) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Error processing request', data: null }, { status: 500 });
    }
}
