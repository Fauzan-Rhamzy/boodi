import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleReviewLike } from "../api/review";

type LikeButtonProps = {
  reviewID: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
};

export default function LikeButton({
  reviewID,
  initialIsLiked,
  initialLikeCount,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = async () => {
    try {
      const data = await toggleReviewLike(reviewID);

      setIsLiked(data.liked);

      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-dark-green"
    >
      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />

      <p className="text-sm pl-0.5 font-medium">{likeCount} likes</p>
    </button>
  );
}
