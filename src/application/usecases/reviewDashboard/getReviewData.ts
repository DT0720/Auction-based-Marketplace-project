// src/application/usecases/reviewDashboard/getReviewData.ts

import { Review } from "@/domain/entities/Review";
import NetworkUtils from "@/lib/networkUtils";

const endpoint = "/api/reviews/user/";

async function getReviewData(userId: number): Promise<Review[]> {
  const response = await NetworkUtils.getRequest<{ message: string; data: Review[] }>(endpoint + userId);
  return response?.data ?? [];
}

export default getReviewData;
