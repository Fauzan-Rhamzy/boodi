import type { Book } from "./book";

export type TrendingReview = {
  review_id: number;
  book_id: number;
  title: string;
  book_cover: string;
  rating: number;
  first_name: string;
  last_name: string;
  user_pic: string;
  comment: string;
  like_count: number;
  is_liked: boolean;
};

export type TrendingReviewResponse = {
  data: TrendingReview[];
  success: boolean;
};

export type BookReviews = {
  review_id: number;
  book_id: number;
  rating: number;
  first_name: string;
  last_name: string;
  user_pic: string;
  comment: string;
  like_count: number;
  is_liked: boolean;
  reply_count: number;
};

export type BookReviewsResponse = {
  data: BookReviews[];
  success: boolean;
};

export interface RatingSummary {
  rating: number;
  count: number;
  percentage: number;
}

export interface RatingSummaryResponse {
  average: number;
  total: number;
  ratings: RatingSummary[];
}
