import { NextResponse } from 'next/server';
import { IOffersRepository } from '@/application/repositories/IOfferRepository';
import { OffersRepository } from '@/infrastructure/repositories/OfferRepository';

const offersRepository: IOffersRepository = new OffersRepository();

/**
 * Handles GET requests to fetch all offers.
 * 
 * This function retrieves all offers from the repository and returns them in the response. 
 * If no offers are found, it responds with a 404 status code and a message indicating no offers were found.
 * If an error occurs during the request, a 500 status code is returned with an appropriate error message.
 * 
 * @returns {NextResponse} A `NextResponse` object containing the offers data and an appropriate HTTP status code.
 *      - If offers are found, the status is 200 (OK).
 *      - If no offers are found, the status is 404 (Not Found).
 *      - If an error occurs, the status is 500 (Internal Server Error).
 */
export async function GET() {
  try {
    // Fetch all offers
    const offers = await offersRepository.getAllOffers();

    // If no offers are found, return a 404 response
    if (!offers || offers.length === 0) {
      return NextResponse.json(
        { message: 'No offers found', data: [] },
        { status: 404 }
      );
    }

    // Return the fetched offers with a 200 status
    return NextResponse.json(
      { message: 'Offers retrieved successfully', data: offers },
      { status: 200 }
    );
  } catch (error: any) {
    // Log the error and return a 500 response if an error occurs
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error', data: [] },
      { status: 500 }
    );
  }
}
