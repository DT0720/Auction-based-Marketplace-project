// src/infrastructure/repositories/ReviewRepository.ts

import { prisma } from '@/infrastructure/database/prisma';

export class ReviewRepository {
  // Existing methods...

  async getReviewById(reviewId: number) {
    try {
      const review = await prisma.review.findUnique({
        where: {
          review_id: reviewId,
        },
        include: {
          buyer: true,
          product: true,
        },
      });
      return review;
    } catch (error) {
      console.error('Error fetching review by ID:', error);
      throw error;
    }
  }
}