import { useState, useEffect } from "react";
import BackArrow from "../components/BackArrow";
import ReviewCard from "../components/ReviewCard";
import { type AuthUser, getMe } from "../features/auth/api";
import type { BookReviews } from "../types/review";
import { useParams } from "react-router";
import type { Book } from "../types/book";
import { getById } from "../api/books";
import { getBookReviews } from "../api/review";
import BookCover from "../components/BookCover";

export default function BookReviews() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<BookReviews[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);

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
        {sortedReviews.map((review) => (
          <ReviewCard
            key={review.review_id}
            review={review}
            userID={user.user_id}
          />
        ))}
      </div>
    </div>
  );
}
