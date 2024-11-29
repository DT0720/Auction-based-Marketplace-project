import NetworkUtils, { ApiResponse } from "@/lib/networkUtils";

const endpoint = "/api/users/wallet/get-balance/";

export async function getUserBalance(user_id: number): Promise<number> {

   const response = await NetworkUtils.getRequest<ApiResponse<number>>(endpoint + user_id);
   
   return response?.data ?? 0;
}

