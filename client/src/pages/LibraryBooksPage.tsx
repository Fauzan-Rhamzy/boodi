import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import BackArrow from "../components/BackArrow";
import BookCover from "../components/BookCover";
import type { Book } from "../types/book";

import SearchBar from "../components/SearchBar";
import {
  getCurrentlyReading,
  getFavouriteBooks,
  getLibrary,
} from "../api/collection";
import type { CurrentlyReadingBook, FavouriteBooks } from "../types/collection";
import {
  CirclePlus,
  CalendarArrowDown,
  CalendarArrowUp,
  ArrowDownZa,
  ArrowDownAz,
  BookA,
  BookPlus,
} from "lucide-react";
import MoreButton from "../components/MoreButton";
import AddBookToCollectionModal from "../components/AddBookToCollectionModal";

export default function LibraryBooksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isCurrentlyReading = location.pathname === "/currently-reading";
  const isFavouriteBooks = location.pathname === "/favourite-books";

  const [libraryName, setLibraryName] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<
    CurrentlyReadingBook[]
  >([]);
  const [favouriteBooks, setFavouriteBooks] = useState<FavouriteBooks[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // Alphabet sorting
  const [alphabetSort, setAlphabetSort] = useState<"az" | "za">("az");
  // Calendar sorting
  const [calendarSort, setCalendarSort] = useState<"newest" | "oldest">(
    "newest",
  );

  // Which type of sorting is currently being used
  const [activeSort, setActiveSort] = useState<"alphabet" | "calendar">(
    isCurrentlyReading ? "calendar" : "alphabet",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchBooks = async () => {
    if (id) {
      const data = await getLibrary(Number(id));
      setLibraryName(data.name);
      setBooks(data.books);
    }
  };

  useEffect(() => {
    async function fetchBooks() {
      try {
        if (isCurrentlyReading) {
          const data = await getCurrentlyReading();
          setCurrentlyReading(data);
        } else if (isFavouriteBooks) {
          const data = await getFavouriteBooks();
          setFavouriteBooks(data);
        } else if (id) {
          const data = await getLibrary(Number(id));

          setLibraryName(data.name);
          setBooks(data.books);
        }
      } catch (error) {
        console.error("Failed to get library books:", error);
      }
    }

    fetchBooks();
  }, [isCurrentlyReading, isFavouriteBooks, id]);

  const sortedBooks = isCurrentlyReading
    ? [...currentlyReading].sort((a, b) => {
        if (activeSort === "calendar") {
          return calendarSort === "newest"
            ? new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
            : new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime();
        }

        return alphabetSort === "az"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      })
    : isFavouriteBooks
      ? [...favouriteBooks].sort((a, b) =>
          alphabetSort === "az"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title),
        )
      : [...books].sort((a, b) =>
          alphabetSort === "az"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title),
        );
  const filteredBooks = sortedBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div className="min-h-screen w-full bg-bw">
      {/* Header */}
      <div className="px-6 pt-3 pb-2">
        <BackArrow useHistory={true} />

        <MoreButton />

        <h1 className="mb-3 ml-2 pt-20 pb-1 text-3xl text-text font-bold">
          {isCurrentlyReading
            ? "Currently Reading"
            : isFavouriteBooks
              ? "Favourite Books"
              : libraryName}
        </h1>

        {/* Buttons */}
        <div className="ml-2 flex gap-2.5 pb-1 items-center">
          {/* Calendar sorting */}
          {isCurrentlyReading && (
            <button
              type="button"
              onClick={() => {
                setActiveSort("calendar");
                setCalendarSort((current) =>
                  current === "newest" ? "oldest" : "newest",
                );
              }}
              className="rounded-full border-2 p-1 transition-colors hover:bg-gray-200"
              aria-label={
                calendarSort === "newest"
                  ? "Sort oldest first"
                  : "Sort newest first"
              }
            >
              {calendarSort === "newest" ? (
                <CalendarArrowUp className="h-5 w-5" />
              ) : (
                <CalendarArrowDown className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Alphabet sorting */}
          <button
            type="button"
            onClick={() => {
              setActiveSort("alphabet");
              setAlphabetSort((current) => (current === "az" ? "za" : "az"));
            }}
            className="rounded-full border-2 p-1 transition-colors hover:bg-gray-200"
            aria-label={alphabetSort === "az" ? "Sort Z-A" : "Sort A-Z"}
          >
            {alphabetSort === "az" ? (
              <ArrowDownZa className="h-5 w-5" />
            ) : (
              <ArrowDownAz className="h-5 w-5" />
            )}
          </button>

          <SearchBar
            className="mt-4 mb-3 w-full"
            onSearch={(query) => setSearchQuery(query)}
          />
        </div>

        {/* <SearchBar
          className="mt-4 mb-3 w-full"
          onSearch={(query) => setSearchQuery(query)}
        /> */}
      </div>

      {/* Books */}
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-10 py-10 text-center">
          <p className="text-lg font-bold text-brown">No book yet</p>

          <p className="mt-1 text-sm text-light-brown">Add a book</p>
        </div>
      ) : (
        <div className="mx-2 grid grid-cols-3 gap-x-3 gap-y-6 px-6 pt-4 items-start">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group cursor-pointer relative aspect-[2/3] w-full rounded-xl border-2 border-dashed border-dark-green/30 bg-light-green/40 flex flex-col items-center justify-center p-3 text-center transition-all duration-200 hover:bg-light-green/70 hover:border-dark-green/60 hover:shadow-sm"
          >
            <div className="rounded-full bg-white p-2.5 shadow-sm transition-transform duration-200 group-hover:scale-110">
              <BookPlus className="w-5 h-5 text-brown" />
            </div>
          </button>

          {filteredBooks.map((book) => (
            <button
              key={book.id}
              onClick={() => navigate(`/bookDetail/${book.id}`)}
              className="cursor-pointer text-left"
            >
              <BookCover book={book} />
            </button>
          ))}
        </div>
      )}

      {id && (
        <AddBookToCollectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          collectionID={Number(id)}
          onSuccess={fetchBooks}
        />
      )}
    </div>
  );
}
