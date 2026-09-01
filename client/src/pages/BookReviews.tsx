import { useState, useEffect } from "react";
import BackArrow from "../components/BackArrow";
import ReviewCard from "../components/ReviewCard";
import { type AuthUser, getMe } from "../features/auth/api";
import type { BookReviews } from "../types/review";
import { useParams } from "react-router";
import type { Book } from "../types/book";
import { getById } from "../api/books";
import { getBookReviews } from "../api/review";

export default function BookReviews() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<BookReviews[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const bookIdNum = Number(id);

      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to get user:", error);
      }

      try {
        const bookData = await getById(bookIdNum);
        setBook(bookData);
      } catch (error) {
        console.error("Failed to get detail book:", error);
      }

      try {
        const reviewData = await getBookReviews(bookIdNum);
        setReviews(reviewData ?? []);
      } catch (error) {
        console.error("Failed to get book reviews:", error);
      }
    }

    fetchData();
  }, [id]);

  if (!book || !user) {
    return <p>Loading...</p>;
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.user_id === user?.user_id) return -1;
    if (b.user_id === user?.user_id) return 1;
    return 0;
  });
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const startIndex = (currentPage - 1) * reviewsPerPage;

  const paginatedReviews = sortedReviews.slice(
    startIndex,
    startIndex + reviewsPerPage,
  );

  return (
    <div className="w-full min-h-screen relative pb-10 pt-5 px-6 bg-bw">
      <div className="w-full flex justify-start ">
        <BackArrow useHistory={true} backPath="/" />
      </div>

      <div className="flex flex-col justify-center items-center mt-15">
        <img
          src={`http://localhost:8080/images/${book.cover}`}
          alt={book.title}
          className="w-45 h-74 shrink-0 object-cover rounded-3xl "
        />
      </div>
      <div className="pt-5 px-2">
        <p className="font-caveat text-2xl font-bold text-dark-green">
          Reviews of
        </p>
        <div className="flex items-center gap-1">
          <p className="font-bold text-text text-2xl">Lorem ipsum</p>
          <div className="w-2 h-2 mt-0.5 rounded-full bg-text"></div>
          <p className="text-lg">2020</p>
        </div>
      </div>
      <div>
        {" "}
        {paginatedReviews.map((review) => (
          <ReviewCard
            key={review.review_id}
            review={review}
            userID={user.user_id}
          />
        ))}
        {paginatedReviews.length === 0 && (
          <p className="text-center mt-8 text-text">No reviews found.</p>
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

            <span className="font-medium text-text">
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
  );
}
