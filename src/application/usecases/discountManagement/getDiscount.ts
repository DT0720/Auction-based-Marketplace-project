// src/application/usecases/reviewDashboard/getReviewData.ts

import { Offers } from "@/domain/entities/Offers";
import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

// Define the endpoint for fetching reviews by user ID

const endpoint = "api/discount/getDiscount/";

/**
 * Fetches a specific discount based on the provided discount type.
 *
 * @param {string} type - The type of discount to fetch.
 * @returns {Promise<Offers | null>} - A promise that resolves to the discount data for the given type, or `null` if no data is found.
 */

export async function getDiscount(type: string): Promise<Offers | null> {
    // Make a GET request to the endpoint with the type parameter

    const response = await NetworkUtils.getRequest<{
        message: string;
        data: Offers;
    }>(endpoint + type);

    // Return the fetched discount data or null if no data is found

    return response?.data ?? null;
}

/**
 * Fetches all available discounts.
 *
 * @returns {Promise<Offers[]>} - A promise that resolves to an array of all available discount objects, or an empty array if no data is found.
 */

export async function getAllDiscounts(): Promise<Offers[]> {
    // Make a GET request to the endpoint to fetch all discounts

    const response = await NetworkUtils.getRequest<ApiResponse<Offers[]>>(
        endpoint + "getAll"
    );

    // Return the fetched discount data or an empty array if no data is found

    return response?.data ?? [];
}
