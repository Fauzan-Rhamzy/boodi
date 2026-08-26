import { Star } from "lucide-react";

interface RatingBarProps {
  star: number;
  count: number;
  total: number;
}

export default function RatingBar({ star, count, total }: RatingBarProps) {
  const percentage = total === 0 ? 0 : (count / total) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex w-10 items-center gap-1">
        <span className="text-lg font-bold">{star}</span>
        <Star className="w-10 h-10 stroke-2 stroke-light-green fill-light-green" />
      </div>

      <div className="h-2 flex-1 overflow-hidden rounded-full bg-light-green/40">
        <div
          className="h-full rounded-full bg-dark-green transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="w-10 text-right text-md text-dark-green">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}
