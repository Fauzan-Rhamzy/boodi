import BackArrow from "../components/BackArrow";

import { Plus, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Book } from "../types/book";
import { getById } from "../api/books";
import {
  AddToFavourite,
  checkIsFavourited,
  DeleteFromFavourite,
} from "../api/collection";
import RatingBox from "../components/RatingBox";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isFavourited, setIsFavourited] = useState(false);

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

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full min-h-screen relative pb-10 bg-bw">
      <div className="w-full flex justify-start px-10">
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

        <div className="flex items-center gap-2">
          <button className="text-xs flex items-center gap-1 bg-text text-white font-medium px-3 py-1 rounded-lg transition">
            <Plus className="w-4 h-4" />
            <span>Track Progress</span>
          </button>

          <button className="w-6 h-6 p-0 shrink-0 flex items-center justify-center rounded-full border border-black text-text">
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFavourite}
            className="w-6 h-6 p-0 shrink-0 flex items-center justify-center rounded-full border border-black text-text"
          >
            <Heart
              className={`w-4 h-4 ${isFavourited ? "fill-red-500 text-red-500" : ""}`}
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

          <div className="h-8 w-px bg-text"></div>

          <div className="px-6">
            <p className="text-sm text-text font-medium">Pages</p>
            <p className="text-base font-bold text-text mt-0.5">{book.page}</p>
          </div>

          <div className="h-8 w-px bg-text"></div>

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

          <div className="flex flex-wrap gap-1.5">
            {book.genres.map((genre) => (
              <span
                key={genre}
                className="flex items-center justify-center px-2 py-2 bg-dark-green text-white text-xs rounded-full leading-none"
              >
                {genre}
              </span>
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
            className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-100"
            style={{ padding: "15px 17px" }}
          >
            <p className="text-text text-sm leading-snug text-justify">
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
          <RatingBox />
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
          <h2
            className="font-bold text-xl mb-3 text-text"
            style={{ marginBottom: "3px", marginTop: "7px" }}
          >
            Reviews
          </h2>

          <div className="flex justify-center">
            <button className="w-full flex justify-center items-center rounded-full bg-dark-green text-white py-1.5 text-sm font-medium active:scale-98 transition-all">
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
