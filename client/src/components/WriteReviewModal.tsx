import { useState } from "react";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";
import { createReview } from "../api/review";

interface WriteReviewModalProps {
  isOpen: boolean;
  bookId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WriteReviewModal({
  isOpen,
  bookId,
  onClose,
  onSuccess,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const resetAndClose = () => {
    setRating(0);
    setComment("");
    setShowConfirm(false);
    onClose();
  };
  const handleClose = () => {
    const hasUnsavedReview = rating > 0 || comment.trim() !== "";

    if (hasUnsavedReview) {
      setShowConfirm(true);
      return;
    }

    resetAndClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please give the book a rating.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review.");
      return;
    }

    setLoading(true);

    try {
      await createReview(bookId, rating, comment.trim());

      toast.success("Review submitted!");
      onSuccess();
      resetAndClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-60 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-70 ">
        <div className="relative w-full rounded-t-3xl bg-white p-6 pb-15 shadow-xl">
          {/* Header */}
          <div className="mb-5 mt-2 flex items-end justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="text-text border-2 rounded-full p-0.5 border-text"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mb-5 mx-2 flex items-center justify-between">
            <h2 className="text-2x font-sans text-2xl font-bold text-text">
              Rating
            </h2>
            <h2 className="text-lg">
              <span>{rating}</span> out of 5
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mx-2">
            {/* Rating */}
            <div>
              <div className="flex gap-4 justify-between mx-5">
                {Array.from({ length: 5 }, (_, index) => {
                  const star = index + 1;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        className={`h-12 w-12 ${
                          star <= rating
                            ? "fill-light-green text-light-green"
                            : "text-light-green"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <textarea
                id="review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                rows={8}
                placeholder="Add a review.."
                className="block w-full resize-none rounded-xl border border-gray-300 bg-light-green/50 px-3 py-2 text-md text-text outline-none focus:border-dark-green focus:ring-1 focus:ring-dark-green"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {comment.length}/500
              </p>

              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-1/3 rounded-full bg-dark-green py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {showConfirm && (
            <div className="absolute inset-0 z-10 flex items-center rounded-t-3xl justify-center  bg-black/50 p-6">
              <div className="w-full rounded-xl bg-white p-5 shadow-xl">
                <h3 className="text-lg font-bold text-text">Discard review?</h3>

                <p className="mt-2 text-sm text-gray-500">
                  You have an unsaved review. Are you sure you want to close it?
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="w-1/2 rounded-md bg-gray-100 py-2 text-sm font-medium text-gray-700"
                  >
                    Keep Writing
                  </button>

                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="w-1/2 rounded-md bg-dark-green py-2 text-sm font-medium text-white"
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
