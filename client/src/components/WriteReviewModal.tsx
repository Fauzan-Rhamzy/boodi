import { useEffect, useState } from "react";

import { Star, X } from "lucide-react";

import toast from "react-hot-toast";

import { createReview, updateReview } from "../api/review";

import type { BookReviews } from "../types/review";
import ConfirmModal from "./ConfirmModal";

interface WriteReviewModalProps {
  isOpen: boolean;
  bookId: number;
  onClose: () => void;
  onSuccess: () => void;
  editReview?: BookReviews | null;
}

export default function WriteReviewModal({
  isOpen,
  bookId,
  onClose,
  onSuccess,
  editReview,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [initialRating, setInitialRating] = useState(0);
  const [initialComment, setInitialComment] = useState("");

  // Fill the form when editing an existing review
  useEffect(() => {
    if (!isOpen) return;

    if (editReview) {
      setRating(editReview.rating);
      setComment(editReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
    if (editReview) {
      setRating(editReview.rating);
      setComment(editReview.comment);

      setInitialRating(editReview.rating);
      setInitialComment(editReview.comment);
    } else {
      setRating(0);
      setComment("");

      setInitialRating(0);
      setInitialComment("");
    }
    setError("");
    setShowConfirm(false);
  }, [isOpen, editReview]);

  const resetAndClose = () => {
    setRating(0);
    setComment("");
    setError("");
    setShowConfirm(false);
    onClose();
  };

  const handleClose = () => {
    const hasChanges =
      rating !== initialRating || comment.trim() !== initialComment.trim();

    if (hasChanges) {
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
      if (editReview) {
        await updateReview(editReview.review_id, rating, comment.trim());

        toast.success("Review updated!");
      } else {
        await createReview(bookId, rating, comment.trim());

        toast.success("Review submitted!");
      }

      await onSuccess();
      resetAndClose();
    } catch (error) {
      console.error("Failed to save review:", error);

      toast.error(
        editReview ? "Failed to update review" : "Failed to submit review",
      );
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
      <div className="fixed inset-x-0 bottom-0 z-70">
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
              {editReview ? "Edit Your Review" : "Rating"}
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
                {loading
                  ? editReview
                    ? "Saving..."
                    : "Submitting..."
                  : editReview
                    ? "Save Changes"
                    : "Submit"}
              </button>
            </div>
          </form>

          {/* Discard confirmation */}
          {showConfirm && (
            <ConfirmModal
              isOpen={showConfirm}
              title="Discard review?"
              message="You have an unsaved review. Are you sure you want to close it?"
              onCancel={() => setShowConfirm(false)}
              onConfirm={resetAndClose}
              cancelText="Keep Writing"
              confirmText="Discard"
            />
          )}
        </div>
      </div>
    </>
  );
}
