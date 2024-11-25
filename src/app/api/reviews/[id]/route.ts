// src/app/api/reviews/[id]/route.ts

import { NextResponse } from 'next/server';
import { ReviewRepository } from '@/infrastructure/repositories/ReviewRepository';

const reviewRepository = new ReviewRepository();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate the review ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const reviewId = parseInt(id, 10);

    // Fetch the review using the repository
    const review = await reviewRepository.getReviewById(reviewId);

    // If review is not found, return a 404 response
    if (!review) {
      return NextResponse.json(
        { message: 'Review not found', data: null },
        { status: 404 }
      );
    }

    // Process or serialize the review data if needed
    const reviewData = {
      ...review,
      rating: Number(review.rating), // Convert rating if necessary
      // Include any other required transformations
    };

    // Return the review data in the response
    return NextResponse.json(
      {
        message: 'Review found',
        data: reviewData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch review', data: null },
      { status: 500 }
    );
  }
}