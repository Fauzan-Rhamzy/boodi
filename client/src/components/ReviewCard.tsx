import { MessageSquare, SquarePen, Star, Trash } from "lucide-react";
import type { BookReviews } from "../types/review.ts";
import LikeButton from "./LikeButton.tsx";

type ReviewCardProps = {
  review: BookReviews;
  userID: number;
  onEdit?: (review: BookReviews) => void;
  onDelete?: (review: BookReviews) => void;
};

export default function ReviewCard({
  review,
  userID,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const isCurrentUser = review.user_id === userID;
  return (
    <div className="flex h-fit w-full shrink-0  gap-4 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-black/5 my-3">
      {/* Book Cover */}

      {/* Review Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1 ">
        <div className="">
          {isCurrentUser ? (
            <div className="flex justify-between mx-1">
              <p className=" font-sans font-extrabold  text-md pb-1.5 pt-1  mb-3 bg-light-green w-fit px-2 rounded-full">
                Your Review
              </p>
              <div className="flex gap-3 mr-2">
                <button
                  onClick={() => onEdit(review)}
                  className="flex items-center gap-1 text-dark-green cursor-pointer"
                >
                  <SquarePen className="bg-light-green p-1 w-8 h-8 rounded-full " />
                </button>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(review)}
                    className="flex items-center gap-1 text-dark-green cursor-pointer"
                  >
                    <Trash className="h-8 w-8 rounded-full bg-light-green p-1" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* Top */}
        <div className="pb-3">
          {/* User */}
          <div className="flex gap-2 items-center">
            <img
              src={`http://localhost:8080/images/${review.user_pic}`}
              alt=""
              className="w-9 h-9 rounded-full"
            />
            <p className="text-lg font-bold text-dark-green pt-1">
              {isCurrentUser ? (
                <span className="font-caveat font-extrabold  text-3xl">
                  You <span className="text-xl">said..</span>
                </span>
              ) : (
                <>
                  {review.first_name} {review.last_name}{" "}
                  <span className="font-caveat text-xl">said..</span>
                </>
              )}
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
          <p className="mt-1 ml-10 mr-2 line-clamp-2 text-md leading-snug font-medium text-dark-green">
            {review.comment}
          </p>
        </div>

        <div className="flex justify-left gap-5 pt-0.5 pb-1 mx-10">
          {/* Likes */}
          <LikeButton
            reviewID={review.review_id}
            initialIsLiked={review.is_liked}
            initialLikeCount={review.like_count}
          />
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
