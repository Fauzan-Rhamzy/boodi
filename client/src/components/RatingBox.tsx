import { Star } from "lucide-react";
import RatingBar from "./RatingBar";
import { useState, useEffect } from "react";
import { getBookRatings } from "../api/review";
import type { RatingSummaryResponse } from "../types/review";

type RatingBoxProps = {
  className?: string;
  bookId: number;
};

export default function RatingBox({ className, bookId }: RatingBoxProps) {
  const [ratingSummary, setRatingSummary] =
    useState<RatingSummaryResponse | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getBookRatings(bookId);
        setRatingSummary(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRatings();
  }, [bookId]);

  return (
    <div className={className}>
      <div className="bg-white w-full h-fit p-7  rounded-xl shadow-md">
        {ratingSummary && (
          <div className="gap-2 flex flex-col">
            {/* Average */}
            <div className="flex items-center gap-2">
              {Array.from({ length: ratingSummary.average }, (_, i) => (
                <Star
                  key={i}
                  className="h-10 w-10 fill-light-green text-light-green"
                />
              ))}
              <span className="text-3xl  font-bold">
                {ratingSummary.average.toFixed(1)}
              </span>
            </div>

            <p>{ratingSummary.total} reviews</p>

            {ratingSummary.ratings.map((rating) => (
              <RatingBar
                key={rating.rating}
                star={rating.rating}
                count={rating.count}
                total={ratingSummary.total}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
