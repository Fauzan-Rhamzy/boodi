import { Heart, MessageSquare, MessageSquareReply, Star } from "lucide-react";
import type { BookReviews } from "../types/review.ts";

type ReviewCardProps = {
  review: BookReviews;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex h-fit w-fullshrink-0  gap-4 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-black/5 my-3">
      {/* Book Cover */}

      {/* Review Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1 ">
        {/* Top */}
        <div className="pb-3">
          {/* User */}
          <div className="flex gap-2 items-center">
            <img
              src={`http://localhost:8080/images/${review.user_pic}`}
              alt=""
              className="w-9 h-9 rounded-full"
            />
            <p className="text-lg font-extrabold text-dark-green ">
              {review.first_name} {review.last_name}{" "}
            </p>
            {/* Rating */}
            <div className=" flex items-center gap-1">
              {Array.from({ length: review.rating }, (_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-light-green text-light-green"
                />
              ))}
            </div>
          </div>
          {/* Comment */}
          <p className="mt-1 ml-10 line-clamp-2 text-md leading-snug text-gray-600">
            {review.comment}
          </p>
        </div>

        <div className="flex justify-left gap-5 pt-0.5 pb-1 mx-10">
          {/* Likes */}
          <div className="flex justify-end items-center gap-1 text-dark-green mr-2">
            <Heart
              className={`h-5 w-5 font-bold ${review.is_liked ? "fill-current" : ""}`}
            />
            <p className="text-sm pl-0.5 font-medium">
              {review.like_count} likes
            </p>
          </div>
          <div className="flex justify-end items-center gap-1 text-dark-green mr-2">
            <MessageSquare className="h-5 w-5 " />
            <p className="text-sm pl-0.5 font-medium">
              {review.reply_count} replies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
