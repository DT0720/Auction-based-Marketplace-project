import { NextResponse } from 'next/server';
import { ISellerInvertoryRepository } from '@/application/repositories/ISellerInventoryRepository';
import { SellerInventoryRepository } from '@/infrastructure/repositories/SellerInventoryRepository';
import { Auction } from '@/domain/entities/Auction';
import { IAuctionRepository } from '@/application/repositories/IAuctionRepository';
import { AuctionRepository } from '@/infrastructure/repositories/AuctionRepository';

const sellerInventoryRepository : ISellerInvertoryRepository = new SellerInventoryRepository();
const auctionRepository : IAuctionRepository = new AuctionRepository();

// Handle POST requests for signup
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      throw new Error('No body received');  // Throw an error if no body is received
    }

    const currentInventory = await sellerInventoryRepository.findByProductId(body.product_id);    

    if (!currentInventory) {
        console.log("Inventory not found");
        throw new Error('Inventory not found'); // Throw an error if the product was not created
    }

    if (body.quantity_for_sale > currentInventory.quantity) {
        console.log("Quantity for sale cannot be greater than quantity in inventory");
        throw new Error('Quantity for sale cannot be greater than quantity in inventory'); // Throw an error if the product was not created
    }

    const activeAuctions = await auctionRepository.findAllProductsOnAuction();

    if (activeAuctions.some(auction => auction.auction.productId === body.product_id)) {
        console.log("Product already on auction");
        throw new Error('Product already on auction'); // Throw an error if the product was not created
    }

    const success = await auctionRepository.create(Auction.fromJson(body)); // Create the product using the use case

    return NextResponse.json(
      { message: success ? 'Auction created successfully' : 'Failed to create auction', data: success },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      return NextResponse.json(
        { message: error.message, data: false },
        { status: 400 }
      );
  }
}
