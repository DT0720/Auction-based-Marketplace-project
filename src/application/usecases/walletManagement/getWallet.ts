import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/users/wallet/get-balance/";

/**
 * Retrieves the wallet balance for a specific user.
 *
 * @param {number} user_id - The unique identifier of the user whose wallet balance needs to be fetched.
 * @returns {Promise<number>} - A promise that resolves to the user's wallet balance. If no balance is found or an error occurs, it returns `0`.
 */

export async function getUserBalance(user_id: number): Promise<number> {
    // Make a GET request to fetch the user's wallet balance

    const response = await NetworkUtils.getRequest<ApiResponse<number>>(
        endpoint + user_id
    );

    // Return the fetched balance or 0 if no data is found

    return response?.data ?? 0;
}
