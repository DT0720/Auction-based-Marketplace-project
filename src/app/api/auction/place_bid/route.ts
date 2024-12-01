import { NextResponse } from 'next/server';
import { IBidRepository } from '@/application/repositories/IBidRepository';
import { BidRepository } from '@/infrastructure/repositories/BidRepository';


const bidRepository: IBidRepository = new BidRepository();

/**
 * Handles POST requests to place a bid on an auction item.
 * 
 * This function processes the bid placed by a user, verifies whether the bid is higher than the current highest bid,
 * checks if the user is bidding on their own bid, and calculates any increment based on the user's previous bids.
 * If the conditions are met, it creates the bid and updates the user's wallet.
 * 
 * @param req - The HTTP request object containing the bid data in the request body.
 * 
 * @returns A `NextResponse` containing a message and the status code. 
 *      - If the bid is successfully placed, the response status is 201 (Created).
 *      - If an error occurs, the response status is 400 (Bad Request).
 */
export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse JSON request body
        let increment = 0;

        if (!body) {
            throw new Error('No body received');  // Throw an error if no body is received
        }

        // Get the history of bids for the specified auction
        const bidHistory = await bidRepository.getBidsByAuctionId(body.auction_id);

        const lastBid = bidHistory.length > 0 ? bidHistory[bidHistory.length - 1] : null;

        console.log("Not own bid: " + JSON.stringify(body));
        if (bidHistory.length > 0) {

            // Sort the bids by price
            bidHistory.sort((a, b) => a.price - b.price);

            // Check if the new bid price is greater than the current highest bid
            if (body.price <= bidHistory[bidHistory.length - 1].price) {
                console.log("Bid price must be greater than the current highest bid");
                throw new Error('Bid price must be greater than the current highest bid'); // Throw an error if the product was not created
            }

            // Ensure the user is not bidding on their own bid
            if (bidHistory[bidHistory.length - 1].buyer_id === body.buyer_id) {
                console.log("You cannot bid on your own bid");
                throw new Error('You cannot bid on your own bid'); // Throw an error if the product was not created
            }

            // Get the user's previous bids
            const userPreviousBids = bidHistory.filter(bid => bid.buyer_id === body.buyer_id);
            if (userPreviousBids.length > 0) {
                // Get the user's highest previous bid
                const highestUserBid = userPreviousBids.reduce((max, bid) => bid.price > max ? bid.price : max, 0);

                // Calculate the difference between the new bid and the highest previous bid
                increment = body.price - highestUserBid;
            }
        }

        console.log("Before creating bid" + JSON.stringify(body));

        // Place the bid and update the user's wallet
        const success = await bidRepository.placeBidAndUpdateWallet(body.user_id, body.buyer_id, body.auction_id, body.price, increment); // Create the product using the use case

        console.log("After creating bid");

        // Return a response indicating the success or failure of the bid creation
        return NextResponse.json(
            { message: success ? 'Bid created successfully' : 'Failed to create bid', data: lastBid?.buyer_id },
            { status: success ? 201 : 400 }
        );

    } catch (error: any) {

        // Return an error response if an exception occurs
        return NextResponse.json(
            { message: error.message, data: null },
            { status: 400 }
        );
    }
}
