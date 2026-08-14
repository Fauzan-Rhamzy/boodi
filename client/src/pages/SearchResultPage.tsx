import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import bgHome from "../assets/bg-home.png";
import { searchBooks } from "../api/books";
import type { Book } from "../types/book";
import BackArrow from "../components/BackArrow";

export default function SearchResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!query) {
      setBooks([]);
      return;
    }

    searchBooks(query)
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error("Failed to search books:", error);
        setBooks([]);
      });
  }, [query]);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${bgHome})`,
      }}
    >
      {/* Header */}
      <div className="px-6 pt-3">
        <BackArrow useHistory={true} />

        <h1 className="mt-4 ml-2 pt-20 text-2xl">
          Result for <span className="font-bold">“{query}”</span>
        </h1>
      </div>

      {/* Results */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-10 py-10 text-center">
          <p className="text-lg font-bold text-gray-700">No books found</p>

          <p className="mt-1 text-sm text-gray-500">
            No book with that title was found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 px-6 mx-2 pt-4">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => navigate(`/bookDetail/${book.id}`)}
              className="text-left cursor-pointer"
            >
              <img
                src={`http://localhost:8080/images/${book.cover}`}
                alt={book.title}
                className="aspect-2/3 w-full rounded-xl object-cover"
              />

              {/* <p className="mt-2 line-clamp-2 text-sm font-semibold">
                {book.title}
              </p> */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
