import { useState } from "react";
import { SquarePen, Trash } from "lucide-react";
import { toast } from "react-hot-toast";

import type { BookReviews } from "../types/review";
import { deleteReview } from "../api/review";
import WriteReviewModal from "./WriteReviewModal";
import ConfirmModal from "./ConfirmModal";

type ReviewActionsProps = {
  review: BookReviews;
  userID: number;
  onRefresh: () => Promise<void>;
};

export default function ReviewActions({
  review,
  userID,
  onRefresh,
}: ReviewActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isOwner = review.user_id === userID;

  if (!isOwner) return null;

  const handleDelete = async () => {
    try {
      await deleteReview(review.review_id);

      toast.success("Review deleted!");

      setIsDeleteOpen(false);

      await onRefresh();
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-1 text-dark-green cursor-pointer"
        >
          <SquarePen className="h-8 w-8 rounded-full bg-light-green p-1" />
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="flex items-center gap-1 text-dark-green cursor-pointer"
        >
          <Trash className="h-8 w-8 rounded-full bg-light-green p-1" />
        </button>
      </div>

      <WriteReviewModal
        isOpen={isEditOpen}
        editReview={review}
        onClose={() => setIsEditOpen(false)}
        onSuccess={async () => {
          setIsEditOpen(false);
          await onRefresh();
        }}
        bookId={0}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete review?"
        message="Are you sure you want to delete this review? This action cannot be undone."
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        cancelText="Cancel"
        confirmText="DELETE"
        destructive
      />
    </>
  );
}
