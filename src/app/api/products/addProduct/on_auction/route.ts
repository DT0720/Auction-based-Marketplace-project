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

    console.log(JSON.stringify(body));  

    const currentInventory = await sellerInventoryRepository.findByProductId(body.product_id);    

    if (!currentInventory) {
        throw new Error('Inventory not found'); // Throw an error if the product was not created
    }

    if (body.quantity_for_sale > currentInventory.quantity) {
        throw new Error('Quantity for sale cannot be greater than quantity in inventory'); // Throw an error if the product was not created
    }

    console.log(Auction.fromJson(body));

    const auction = await auctionRepository.create(Auction.fromJson(body)); // Create the product using the use case

    return NextResponse.json(
      { message: auction ? 'Auction created successfully' : 'Failed to update inventory', data: auction },
      { status: auction ? 201 : 400 }
    );

  } catch (error: any) {
      console.log(error.message);
      return NextResponse.json(
        { message: 'Failed to create auction', data: null },
        { status: 400 }
      );
  }
}
