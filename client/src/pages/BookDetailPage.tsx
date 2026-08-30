import BackArrow from "../components/BackArrow";

import { Plus, Heart } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Book } from "../types/book";
import { getById } from "../api/books";
import {
  AddToFavourite,
  checkIsFavourited,
  DeleteFromFavourite,
} from "../api/collection";
import TrackProgressPopUp from "../components/TrackProgressPopUP";
import RatingBox from "../components/RatingBox";
import ReviewCard from "../components/ReviewCard";
import { getBookReviews } from "../api/review";
import type { BookReviews } from "../types/review";
import { type AuthUser, getMe } from "../features/auth/api";
import { getUserBookProgress, trackBookProgress, type TrackProgressPayload } from "../api/users";
import toast from "react-hot-toast";
export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isFavourited, setIsFavourited] = useState(false);
  const [reviews, setReviews] = useState<BookReviews[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

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
  }, []);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.user_id === user?.user_id) return -1;
    if (b.user_id === user?.user_id) return 1;
    return 0;
  });

  useEffect(() => {
    async function fetchDetailBookAndFavorite() {
      if (!id) return;
      const bookIdNum = Number(id);

      // 1. Ambil detail buku terlebih dahulu (Wajib)
      try {
        const bookData = await getById(bookIdNum);
        setBook(bookData);
      } catch (error) {
        console.error("Failed to get detail book:", error);
      }

      // 2. Ambil status favorit secara terpisah (Opsional)
      try {
        const favStatus = await checkIsFavourited(bookIdNum);
        setIsFavourited(favStatus);
      } catch (error) {
        console.error("Failed to get favourite status:", error);
      }
      try {
        const reviewData = await getBookReviews(bookIdNum);
        setReviews(reviewData ?? []);
      } catch (error) {
        console.error("Failed to get book reviews:", error);
      }
      try {
        const progress = await getUserBookProgress(bookIdNum);
        setCurrentPage(progress.current_page || 0);
      } catch (error) {
        console.error("Failed to get progress:", error);
      }
    }

    fetchDetailBookAndFavorite();
  }, [id]);

  const handleToggleFavourite = async () => {
    if (!book) return;

    try {
      if (isFavourited) {
        await DeleteFromFavourite(book.id);
        setIsFavourited(false);
      } else {
        await AddToFavourite(book.id);
        setIsFavourited(true);
      }
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
    }
  };

  const memoizedInitialBook = useMemo(() => {
    if (!book) return null;
    return {
      id: book.id,
      title: book.title,
      cover: book.cover,
      page: book.page,
      current_page: currentPage, 
    };
  }, [book?.id, book?.title, book?.cover, currentPage]);

  const handleSave = useCallback(async (data: { book_id: number; pages_read: number; read_date: string }) => {
    const loading = toast.loading("Saving progress...");

    try {
      await trackBookProgress(data.book_id, data.pages_read, data.read_date);
      setCurrentPage(data.pages_read);
      toast.dismiss(loading);
      toast.success("Track updated!");
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to track book update");
      throw error;
    }
  }, []);

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full min-h-screen relative pb-10 bg-bw">
      <div className="w-full flex justify-start px-6">
        <BackArrow useHistory={true} backPath="/" />
      </div>

      <div className="flex flex-col items-center pt-5 pb-10 px-4">
        <img
          src={`http://localhost:8080/images/${book.cover}`}
          alt={book.title}
          className="w-45 h-64 shrink-0 object-cover rounded-3xl mt-15"
        />

        <h1
          className="text-center text-3xl font-bold text-text mb-2"
          style={{ marginTop: "5px" }}
        >
          {book.title}
        </h1>

        <div className="flex items-center gap-1 text-light-brown mb-2">
          <span className="text-text">{book.year}</span>
          <span>•</span>

          {book.authors && book.authors.length > 0 ? (
            <>
              <span>Written by</span>
              <Link
                to={`/author/${book.authors[0].id}`}
                className="font-bold underline cursor-pointer text-text underline-offset-3 active: light brown active: scale-95 duration 100"
              >
                {book.authors[0].name}
              </Link>
            </>
          ) : (
            <span>Unknown Author</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <button 
          onClick={() => setIsModalOpen(true)}
          className="text-sm flex items-center gap-1 bg-text text-white font-medium px-3 py-1 rounded-lg transition">
            <Plus className="w-6 h-6" />
            <span className="text-md">Track Progress</span>
          </button>

          <button className="w-8 h-8 p-0 shrink-0 flex items-center justify-center rounded-full border border-black text-text">
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={handleToggleFavourite}
            className="w-8 h-8 p-0 shrink-0 flex items-center justify-center rounded-full border border-black text-text"
          >
            <Heart
              className={`w-6 h-6 ${isFavourited ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>
        </div>

        <div className="flex items-center text-center mt-4">
          <div className="px-6">
            <p className="text-sm text-text font-medium">Price</p>
            <p className="text-base font-bold text-text mt-0.5">
              ${book.price.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="h-8 w-px shrink-0 bg-text"></div>

          <div className="px-6">
            <p className="text-sm text-text font-medium">Pages</p>
            <p className="text-base font-bold text-text mt-0.5">{book.page}</p>
          </div>

          <div className="h-8 w-px shrink-0 bg-text"></div>

          <div className="px-6">
            <p className="text-sm text-text font-medium">Language</p>
            <p className="text-base font-bold text-text mt-0.5">
              {book.language}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-4">
          <h2
            className="font-bold text-xl mb-3 text-text"
            style={{ marginBottom: "3px", marginTop: "7px" }}
          >
            Genres
          </h2>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {(book.genres ?? []).map((genre) => (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}`}
                className="flex items-center justify-center p-2 px-5 bg-dark-green text-white text-md rounded-full leading-none"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
          <h2
            className="font-bold text-xl mb-3 text-text"
            style={{ marginBottom: "3px", marginTop: "7px" }}
          >
            Description
          </h2>

          <div
            className="w-full p-6 bg-white rounded-2xl shadow-md border mt-2 border-gray-100"
            style={{ padding: "15px 17px" }}
          >
            <p className="text-text text-md leading-snug text-justify">
              {book.description}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
          <h2
            className="font-bold text-xl mb-3 text-text"
            style={{ marginBottom: "3px", marginTop: "7px" }}
          >
            Ratings
          </h2>
          <RatingBox bookId={book.id} className="pt-1" />
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
          <h2
            className="font-bold text-xl mb-3 text-text"
            style={{ marginBottom: "3px", marginTop: "7px" }}
          >
            Reviews
          </h2>

          <div className="flex flex-col items-center  justify-center mt-2 gap-2 pb-6">
            <button className="w-19/20 flex justify-center items-center rounded-full bg-dark-green text-white py-2.5 text-md font-medium active:scale-98 transition-all">
              Write a Review
            </button>
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.review_id}
                review={review}
                userID={user.user_id}
              />
            ))}
          </div>
        </div>
      </div>

      <TrackProgressPopUp
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialBook={memoizedInitialBook}
        onSave={handleSave}
      />
    </div>
  );
}
