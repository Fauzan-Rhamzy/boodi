import { ChevronDown, ChevronsRight } from "lucide-react";
import SearchBar from "../components/SearchBar";
import bgHome from "../assets/bg-home.png";
import pfp from "../assets/dummy-pfp.png";
import ReviewCard from "../components/ReviewCard";
import Navbar from "../components/Navbar";
import HorizontalBookList from "../components/HorizontalBookList";
import { useEffect, useState } from "react";
import type { Book } from "../types/book";
import { getCurrentlyReading, getTrendingBooks } from "../api/books";
import { getTrendingReviews } from "../api/review";
import type { TrendingReview } from "../types/review";
import { getMe, type AuthUser } from "../features/auth/api";
export default function HomePage() {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
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
    <div
      className=" relative w-full min-h-screen"
      style={{
        backgroundImage: `url(${bgHome})`,
        backgroundSize: "100% auto",
        backgroundRepeat: "repeat-y",
        backgroundPosition: "top center",
      }}
    >
      {/* header */}
      <div className="flex justify-between mx-7 pt-15">
        <div>
          <p className="text-3xl font-bold">
            Hi, {user?.first_name ?? "there"}!
          </p>
          <p className="text-gray-600 text-md font-medium mt-0.5">
            Let's read a new book~
          </p>
        </div>
        <div className="flex items-center gap-1">
          <img src={pfp} className="w-10 h-10 rounded-full"></img>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* content */}
      <div className="mx-6">
        <div className="mt-7 flex justify-center">
          <SearchBar />
        </div>
        <div className="mx-0.5">
          {/* currently reading */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Currently Reading</p>
              <button className="flex items-center gap-1 text-md text-gray-500">
                See all
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
            {currentlyReading.length > 0 ? (
              <HorizontalBookList
                title="Currently Reading"
                books={currentlyReading}
              />
            ) : (
              <p className="mt-3 text-sm text-gray-500">Read a new book~</p>
            )}
          </div>

          {/* trending book */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Trending Books</p>
              <button className="flex items-center gap-1 text-md text-gray-500">
                See all
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
            <HorizontalBookList title="Trending Books" books={trendingBooks} />
          </div>
          {/* trending review */}
          <div className="mt-6 pb-30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-bold">Trending Review</p>
            </div>
            {trendingReviews.map((review) => (
              <ReviewCard key={review.review_id} review={review} />
            ))}
          </div>
        </div>
      </div>
      {/* navbar */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 bg-white">
        <Navbar />
      </div>
    </div>
  );
}
