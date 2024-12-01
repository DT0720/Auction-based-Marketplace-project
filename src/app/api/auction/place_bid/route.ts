import { NextResponse } from 'next/server';
import { IBidRepository } from '@/application/repositories/IBidRepository';
import { BidRepository } from '@/infrastructure/repositories/BidRepository';


const bidRepository: IBidRepository = new BidRepository();

// Handle POST requests for signup
export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse JSON request body
        let increment = 0;

        if (!body) {
            throw new Error('No body received');  // Throw an error if no body is received
        }

        const bidHistory = await bidRepository.getBidsByAuctionId(body.auction_id);

        const lastBid = bidHistory.length > 0 ? bidHistory[bidHistory.length - 1] : null;

        console.log("Not own bid: " + JSON.stringify(body));
        if (bidHistory.length > 0) {
            bidHistory.sort((a, b) => a.price - b.price);
            if (body.price <= bidHistory[bidHistory.length - 1].price) {
                console.log("Bid price must be greater than the current highest bid");
                throw new Error('Bid price must be greater than the current highest bid'); // Throw an error if the product was not created
            }

            if (bidHistory[bidHistory.length - 1].buyer_id === body.buyer_id) {
                console.log("You cannot bid on your own bid");
                throw new Error('You cannot bid on your own bid'); // Throw an error if the product was not created
            }

            const userPreviousBids = bidHistory.filter(bid => bid.buyer_id === body.buyer_id);
            if (userPreviousBids.length > 0) {
                // Get the user's highest previous bid
                const highestUserBid = userPreviousBids.reduce((max, bid) => bid.price > max ? bid.price : max, 0);

                // Calculate the difference between the new bid and the highest previous bid
                increment = body.price - highestUserBid;
            }
        }

        console.log("Before creating bid" + JSON.stringify(body));

        const success = await bidRepository.placeBidAndUpdateWallet(body.user_id, body.buyer_id, body.auction_id, body.price, increment); // Create the product using the use case

        console.log("After creating bid");

        return NextResponse.json(
            { message: success ? 'Bid created successfully' : 'Failed to create bid', data: lastBid?.buyer_id },
            { status: success ? 201 : 400 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message, data: null },
            { status: 400 }
        );
    }
}
