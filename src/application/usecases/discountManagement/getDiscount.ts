// src/application/usecases/reviewDashboard/getReviewData.ts

import { Offers } from "@/domain/entities/Offers";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

// Define the endpoint for fetching reviews by user ID

const endpoint = "api/discount/getDiscount/";

/**
 * Fetches review data for a given user ID.
 * @param userId - The ID of the user whose reviews are to be fetched.
 * @returns A promise that resolves to an array of Review objects.
 */

export async function getDiscount(type: string): Promise<Offers|null> {
  // Make a GET request to the endpoint with the user ID
  const response = await NetworkUtils.getRequest<{ message: string; data: Offers }>(endpoint + type);
   // Return the fetched review data or an empty array if no data is found
  return response?.data ?? null;
}

export async function getAllDiscounts(): Promise<Offers[]>{
  // Make a GET request to the endpoint with the user ID
  const response = await NetworkUtils.getRequest<ApiResponse<Offers[]>>(endpoint + "getAll");
  // Return the fetched review data or an empty array if no data is found
 return response?.data ?? [];
}
