// src/app/api/reviews/user/[userId]/route.ts

import { NextResponse } from 'next/server';
import { ReviewRepository } from '@/infrastructure/repositories/ReviewRepository';

// Create an instance of the ReviewRepository
const reviewRepository = new ReviewRepository();

/**
 * GET handler for fetching reviews by user ID.
 * @param req - The request object.
 * @param params - The route parameters containing the user ID.
 * @returns A JSON response with the reviews or an error message.
 */

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Validate the user ID
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const user_id = parseInt(userId, 10);

    // Fetch the reviews using the repository
    const reviews = await reviewRepository.getReviewsByUserId(user_id);

    // If reviews are not found, return a 404 response
    if (!reviews || reviews.length === 0) {
      return NextResponse.json(
        { message: 'No reviews found', data: [] },
        { status: 404 }
      );
    }

    // Return the reviews data in the response
    return NextResponse.json(
      {
        message: 'Reviews found',
        data: reviews,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch reviews', data: [] },
      { status: 500 }
    );
  }
}