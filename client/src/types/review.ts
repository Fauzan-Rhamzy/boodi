export type TrendingReview = {
  review_id: number;
  book_id: number;
  title: string;
  cover: string;
  rating: number;
  first_name: string;
  last_name: string;
  comment: string;
  like_count: number;
  is_liked: boolean;
};

export type TrendingReviewResponse = {
  data: TrendingReview[];
  success: boolean;
};
