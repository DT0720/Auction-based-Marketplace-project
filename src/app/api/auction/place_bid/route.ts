import { NextResponse } from 'next/server';
import { IBidRepository } from '@/application/repositories/IBidRepository';
import { BidRepository } from '@/infrastructure/repositories/BidRepository';

const bidRepository : IBidRepository = new BidRepository();

// Handle POST requests for signup
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      throw new Error('No body received');  // Throw an error if no body is received
    }

    const bidHistory = await bidRepository.getBidsByAuctionId(body.auction_id);

    console.log("Not own bid: "+ JSON.stringify(body));
    if(bidHistory.length > 0){
        bidHistory.sort((a, b) => a.price - b.price);
        if (body.price <= bidHistory[bidHistory.length - 1].price) {
            console.log("Bid price must be greater than the current highest bid");
            throw new Error('Bid price must be greater than the current highest bid'); // Throw an error if the product was not created
        }

        if(bidHistory[bidHistory.length - 1].buyer_id === body.buyer_id){
            console.log("You cannot bid on your own product");
            throw new Error('You cannot bid on your own product'); // Throw an error if the product was not created
        }
    }

    const success = await bidRepository.createBid(body.auction_id, body.buyer_id, body.price); // Create the product using the use case

    console.log("After creating bid");

    if(success) console.log("Bid created successfully");

    return NextResponse.json(
      { message: success ? 'Bid created successfully' : 'Failed to create bid', data: success },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      return NextResponse.json(
        { message: error.message, data: false },
        { status: 400 }
      );
  }
}
