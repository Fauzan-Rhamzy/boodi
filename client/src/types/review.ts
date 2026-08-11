export type TrendingReview = {
  review_id: number;
  book_cover: string;
  rating: number;
  first_name: string;
  last_name: string;
  comment: string;
  like_count: number;
};

export type TrendingReviewResponse = {
  data: TrendingReview[];
  success: boolean;
};
