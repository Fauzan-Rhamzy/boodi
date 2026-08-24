import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import bgHome from "../assets/bg-home.png";
import { getAllBooks, searchBooks } from "../api/books";
import type { Book } from "../types/book";
import BookCover from "../components/BookCover";
import SearchBar from "../components/SearchBar";

export default function SearchResultPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [books, setBooks] = useState<Book[]>([]);
  const hasLongWord = searchQuery.split(/\s+/).some((word) => word.length > 20);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = searchQuery
          ? await searchBooks(searchQuery)
          : await getAllBooks();

        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, [searchQuery]);

  return (
    <div className=" flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="flex px-6 pt-3">
        <h1 className="mt-4 ml-2 pt-20 text-5xl font-caveat font-bold pb-3">
          Find a Book
        </h1>
      </div>
      <div className="flex items-center justify-center pb-2">
        <SearchBar
          className="mt-4 mb-3 w-17/20"
          onSearch={(query) => setSearchQuery(query)}
        />
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
            <BookCover book={book} key={book.id} />
          ))}
        </div>
      )}
    </div>
  );
}
