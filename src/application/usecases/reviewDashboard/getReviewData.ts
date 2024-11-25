// src/application/usecases/reviewDashboard/getReviewData.ts

import { Review } from "@/domain/entities/Review";
import NetworkUtils from "@/lib/networkUtils";

const endpoint = "/api/reviews/";

async function getReviewData(reviewId: number): Promise<Review | null> {
  const response = await NetworkUtils.getRequest<Review>(
    endpoint + reviewId
  );

  return response ?? null;
}

export default getReviewData;