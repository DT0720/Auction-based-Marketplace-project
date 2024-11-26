// src/infrastructure/repositories/ReviewRepository.ts

import { prisma } from '@/infrastructure/database/prisma';

export class ReviewRepository {
  // Existing methods...

  async getReviewsByUserId(userId: number) {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          user_id: userId,
        },
        include: {
          buyer: true,
          product: true,
        },
      });
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews by user ID:', error);
      throw error;
    }
  }
}