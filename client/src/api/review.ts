import api from "../lib/axios";
import type {
  BookReviews,
  BookReviewsResponse,
  TrendingReview,
} from "../types/review";

export async function getTrendingReviews(): Promise<TrendingReview[]> {
  const response = await api.get<TrendingReview[]>("/api/reviews/trending");

  return response.data.data;
}
export async function getBookReviews(bookId: number): Promise<BookReviews[]> {
  const response = await api.get<BookReviews[]>(`/api/reviews/book/${bookId}`);
  console.log("API RESPONSE:", response.data);
  return response.data.data;
}
