import api from "../lib/axios";
import type { TrendingReview } from "../types/review";

export async function getTrendingReviews(): Promise<TrendingReview[]> {
  const response = await api.get<TrendingReview[]>("/api/reviews/trending");

  return response.data.data;
}
