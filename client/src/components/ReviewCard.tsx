import { Heart, Star } from "lucide-react";
import type { TrendingReview } from "../types/review.ts";

type ReviewCardProps = {
  review: TrendingReview;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex h-36 w-86 shrink-0 gap-4 rounded-2xl bg-[#F1E7F8]/40 p-3 shadow-md ring-1 ring-black/5 my-3">
      {/* Book Cover */}
      <div className="h-full w-24 shrink-0 overflow-hidden rounded-xl shadow-sm">
        <img
          src={`http://localhost:8080/images/${review.book_cover}`}
          alt="Book cover"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Review Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        {/* Top */}
        <div>
          {/* Rating */}
          <div className="mb-1 flex items-center gap-1">
            {Array.from({ length: review.rating }, (_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-500 text-yellow-500"
              />
            ))}
          </div>

          {/* User */}
          <p className="text-md font-bold text-gray-800 pt-1">
            {review.first_name} {review.last_name} said..
          </p>

          {/* Comment */}
          <p className="mt-1 line-clamp-3 text-sm leading-snug text-gray-600">
            {review.comment}
          </p>
        </div>

        {/* Likes */}
        <div className="flex justify-end items-center gap-1 text-red-600 mr-2">
          <Heart className="h-4 w-4 fill-current" />
          <p className="text-xs font-medium">{review.like_count} likes</p>
        </div>
      </div>
    </div>
  );
}
