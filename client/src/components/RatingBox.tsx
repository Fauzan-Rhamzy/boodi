import { Star } from "lucide-react";
import RatingBar from "./RatingBar";

type RatingBoxProps = {
  className?: string;
};
const ratingCount = {
  5: 180,
  4: 60,
  3: 20,
  2: 8,
  1: 12,
};

const total = Object.values(ratingCount).reduce((a, b) => a + b, 0);

export default function RatingBox({ className }: RatingBoxProps) {
  return (
    <div className={className}>
      <div
        className="bg-white w-full
  h-fit p-7 pb-2 rounded-xl shadow-md"
      >
        <div className="flex justify-between">
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className="h-8 w-8  text-light-green font-extrabold"
              />
            ))}
          </div>
          <p className="font-extrabold text-3xl">1.0</p>
        </div>
        <p className="pt-1 pb-2"> 123 reviews</p>
        <div className="pt-2">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                star={star}
                count={ratingCount[star as keyof typeof ratingCount]}
                total={total}
              />
            ))}
          </div>
          ;
        </div>
      </div>
    </div>
  );
}
