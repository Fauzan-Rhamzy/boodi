import { useEffect, useState } from "react";
import { getMe } from "../features/auth/api";
import ProfileHeader from "../components/ProfileHeader";
import type { User } from "../types/users";
import { getUserProfile } from "../api/users";
import SearchBar from "../components/SearchBar";
import TrendingReviewCard from "../components/TrendingReviewCard";
import type { BookReviews, TrendingReview } from "../types/review";
import { getUserReviews } from "../api/review";

export default function ProfileReviewsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<TrendingReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 10;

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getMe();
        const fullProfile = await getUserProfile(user.user_id);
        setUser(fullProfile);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);
  useEffect(() => {
    async function fetchReviews() {
      try {
        const reviewData = await getUserReviews();
        setReviews(reviewData ?? []);
      } catch (error) {
        console.error("Failed to get user reviews:", error);
      }
    }

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;

    return (
      review.title.toLowerCase().includes(query) ||
      review.comment.toLowerCase().includes(query)
    );
  });
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const startIndex = (currentPage - 1) * reviewsPerPage;

  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + reviewsPerPage,
  );
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  return (
    <div className="w-full min-h-screen relative pb-24 bg-bw ">
      <div className="flex flex-col gap-3 justify-center items-center">
        <ProfileHeader user={user} />
        <SearchBar onSearch={handleSearch} className="w-8/10" />
      </div>

      <div className="flex mt-2 pb-30 justify-center items-center">
        <div className="w-13/15">
          {paginatedReviews.map((review) => (
            <TrendingReviewCard key={review.review_id} review={review} />
          ))}

          {paginatedReviews.length === 0 && (
            <p className="text-center text-text mt-8">No reviews found.</p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="px-4 py-2 rounded-lg bg-dark-green text-white disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-text font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="px-4 py-2 rounded-lg bg-dark-green text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
