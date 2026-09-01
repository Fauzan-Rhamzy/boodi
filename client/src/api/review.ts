import api from "../lib/axios";
import type {
  BookReviews,
  BookReviewsResponse,
  RatingSummaryResponse,
  TrendingReview,
} from "../types/review";

export async function getTrendingReviews(): Promise<TrendingReview[]> {
  const response = await api.get<TrendingReview[]>("/api/reviews/trending");

  return response.data.data;
}
export async function getBookReviews(bookId: number): Promise<BookReviews[]> {
  const response = await api.get<BookReviews[]>(`/api/reviews/book/${bookId}`);
  return response.data.data;
}

export const getBookRatings = async (
  bookId: number,
): Promise<RatingSummaryResponse> => {
  const response = await api.get(`/api/book/${bookId}/ratings`);

  return response.data.data;
};

export async function getUserReviews(): Promise<TrendingReview[]> {
  const response = await api.get<TrendingReview[]>("/api/profile/reviews");
  return response.data.data;
}

export async function toggleReviewLike(reviewID: number) {
  const response = await api.post(`/api/reviews/${reviewID}/like`);

  return response.data;
}
