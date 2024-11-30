import { NextResponse } from 'next/server';
import { IOffersRepository } from '@/application/repositories/IOfferRepository';
import { OffersRepository } from '@/infrastructure/repositories/OfferRepository';

const offersRepository: IOffersRepository = new OffersRepository();

// Handle GET requests to fetch all offers
export async function GET() {
  try {
    const offers = await offersRepository.getAllOffers(); // Fetch all offers

    if (!offers || offers.length === 0) {
      return NextResponse.json(
        { message: 'No offers found', data: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Offers retrieved successfully', data: offers },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error', data: [] },
      { status: 500 }
    );
  }
}
