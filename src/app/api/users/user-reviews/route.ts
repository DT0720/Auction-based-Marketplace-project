import { NextResponse } from 'next/server';
import { ReviewRepository } from '@/infrastructure/repositories/ReviewRepository';

const reviewRepository = new ReviewRepository();

// Handle GET requests for fetching user reviews
export async function GET(req: Request) {
    try {
        const userId = req.url.split('/').pop(); // Extract user ID from the URL
        const reviews = await reviewRepository.getReviewsByUserId(Number(userId)); // Fetch reviews by user ID

        return NextResponse.json(reviews, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch reviews' },
            { status: 400 }
        );
    }
}