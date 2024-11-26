// src/application/usecases/reviewDashboard/getReviewData.ts

import { Review } from "@/domain/entities/Review";
import NetworkUtils from "@/lib/networkUtils";

// Define the endpoint for fetching reviews by user ID

const endpoint = "/api/reviews/user/";

/**
 * Fetches review data for a given user ID.
 * @param userId - The ID of the user whose reviews are to be fetched.
 * @returns A promise that resolves to an array of Review objects.
 */

async function getReviewData(userId: number): Promise<Review[]> {
  // Make a GET request to the endpoint with the user ID
  const response = await NetworkUtils.getRequest<{ message: string; data: Review[] }>(endpoint + userId);
   // Return the fetched review data or an empty array if no data is found
  return response?.data ?? [];
}

export default getReviewData;
