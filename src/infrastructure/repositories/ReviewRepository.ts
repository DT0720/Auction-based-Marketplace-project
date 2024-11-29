// src/infrastructure/repositories/ReviewRepository.ts

import { prisma } from '@/infrastructure/database/prisma';

export class ReviewRepository {
  // Existing methods...
   /**
   * Fetches reviews for a given user ID.
   * @param userId - The ID of the user whose reviews are to be fetched.
   * @returns A promise that resolves to an array of reviews.
   */

  async getReviewsByUserId(userId: number) {
    try {
         // Fetch reviews from the database where the user_id matches the given userId
      const reviews = await prisma.review.findMany({
        where: {
          user_id: userId,
        },
        include: {
          buyer: true, // Include buyer details in the fetched reviews
          product: true, // Include product details in the fetched reviews
        },
      });
      return reviews;
    } catch (error) {
       // Log and rethrow any errors that occur during the fetch operation
      console.error('Error fetching reviews by user ID:', error);
      throw error;
    }
  }
}