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
  const [showLikedText, setShowLikedText] = useState(false);

  const handleLike = async () => {
    try {
      const data = await toggleReviewLike(reviewID);

      setIsLiked(data.liked);

      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));

      if (data.liked) {
        setShowLikedText(true);

        setTimeout(() => {
          setShowLikedText(false);
        }, 1000);
      } else {
        setShowLikedText(false);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-dark-green"
    >
      <Heart
        className={`h-5 w-5  ${isLiked ? "fill-current animate-pop" : ""}`}
      />

      {showLikedText ? (
        <p className="text-sm font-medium animate-pop">Liked!</p>
      ) : (
        <p className="text-sm font-medium">{likeCount} likes</p>
      )}
    </button>
  );
}
