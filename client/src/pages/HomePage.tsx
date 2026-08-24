import { ArrowRight, ChevronsRight } from "lucide-react";

import pfp from "../assets/dummy-pfp.png";
import ReviewCard from "../components/ReviewCard";
import HorizontalBookList from "../components/HorizontalBookList";
import UserProfile from "../components/UserProfile";
import { useEffect, useState } from "react";
import type { Book } from "../types/book";
import { getTrendingReviews } from "../api/review";
import type { TrendingReview } from "../types/review";
import { getMe, type AuthUser } from "../features/auth/api";
import { useNavigate } from "react-router";
import { getTrendingBooks, getCurrentlyReading } from "../api/collection";
export default function HomePage() {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [trendingReviews, setTrendingReviews] = useState<TrendingReview[]>([]);
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getMe();
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();

    async function fetchTrendingBooks() {
      try {
        const books = await getTrendingBooks();
        setTrendingBooks(books);
      } catch (error) {
        console.error("Failed to get trending books:", error);
      }
    }

    fetchTrendingBooks();

    async function fetchTrendingReviews() {
      try {
        const reviews = await getTrendingReviews();
        setTrendingReviews(reviews);
      } catch (error) {
        console.error("Failed to get trending reviews:", error);
      }
    }

    fetchTrendingReviews();

    async function fetchCurrentlyReading() {
      try {
        const books = await getCurrentlyReading();
        setCurrentlyReading(books);
      } catch (error) {
        console.error("Failed to get currently reading:", error);
      }
    }

    fetchCurrentlyReading();
  }, []);
  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl">
      {/* header */}
      <div className="flex relative z-11 justify-between mx-7 pt-15">
        <div>
          <p className="text-4xl font-bold font-caveat pb-1">
            Hi, {user?.first_name ?? "there"}!
          </p>
          <p className="text-gray-600 text-md font-medium mt-0.5">
            Let's read a new book~
          </p>
        </div>
        <div className="flex items-center gap-1">
          <UserProfile pfp={pfp} />
        </div>
      </div>

      {/* content */}
      <div className="mx-6 relative z-10">
        <div className="mx-0.5">
          {/* currently reading */}
          <div className="mt-6 ">
            <div className="flex items-center justify-between ">
              <p className="text-xl font-bold pb-1 ">Currently Reading</p>
              <button
                className="flex items-center gap-1 text-md text-dark-green"
                onClick={() => navigate(`/currently-reading`)}
              >
                See all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {currentlyReading.length > 0 ? (
              <HorizontalBookList
                title="Currently Reading"
                books={currentlyReading}
              />
            ) : (
              <p className="mt-3 text-sm text-dark-green">Read a new book~</p>
            )}
          </div>

          {/* trending book */}
          <div className="mt-6">
            <div className="flex items-center justify-between pb-1">
              <p className="text-xl font-bold">Trending Books</p>
            </div>
            <HorizontalBookList title="Trending Books" books={trendingBooks} />
          </div>
          {/* trending review */}
          <div className="mt-6 pb-30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xl font-bold">Trending Review</p>
            </div>
            {trendingReviews.map((review) => (
              <ReviewCard key={review.review_id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
