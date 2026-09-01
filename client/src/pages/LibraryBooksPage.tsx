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
  removeBookFromCollection,
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
  Trash2,
  PlusCircle,
  Check,
  Minus,
} from "lucide-react";
import MoreButton from "../components/MoreButton";
import AddBookToCollectionModal from "../components/AddBookToCollectionModal";
import toast from "react-hot-toast";
import BookCardWithMenu from "../components/BookCardWithMenu";

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

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Set<number>>(new Set());

  const handleRemoveBook = async (bookID: number) => {
    if (!id) return;
    try {
      await removeBookFromCollection(Number(id), bookID);
      toast.success("Book removed");
      // hapus dari state langsung tanpa fetch ulang
      setBooks((prev) => prev.filter((b) => b.id !== bookID));
    } catch {
      toast.error("Failed to remove book");
    }
  };

  const handleSelect = (bookID: number) => {
    setSelectedBooks((prev) => {
      const next = new Set(prev);
      next.has(bookID) ? next.delete(bookID) : next.add(bookID);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedBooks.size === books.length) {
      // kalau semua sudah dipilih — deselect all
      setSelectedBooks(new Set());
    } else {
      // pilih semua
      setSelectedBooks(new Set(books.map((b) => b.id)));
    }
  };

  const handleCancelSelect = () => {
    setIsSelectMode(false);
    setSelectedBooks(new Set());
  };

  const handleBulkRemove = async () => {
    if (!id || selectedBooks.size === 0) return;

    try {
      await Promise.all(
        [...selectedBooks].map((bookID) =>
          removeBookFromCollection(Number(id), bookID),
        ),
      );
      toast.success(`${selectedBooks.size} book(s) removed`);
      setBooks((prev) => prev.filter((b) => !selectedBooks.has(b.id)));
      handleCancelSelect();
    } catch {
      toast.error("Failed to remove books");
    }
  };

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

  useEffect(() => {
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

        {!isCurrentlyReading && !isFavouriteBooks && !isSelectMode && (
          // mode select — hanya Cancel di kanan
          // <button
          //   onClick={handleCancelSelect}
          //   className="absolute top-10 right-6 text-sm font-medium text-gray-500 cursor-pointer"
          // >
          //   Cancel
          // </button>
          <MoreButton onSelectBooks={() => setIsSelectMode(true)} />
        )}

        <h1 className="mb-3 ml-2 pt-20 pb-1 text-3xl text-text font-bold">
          {isCurrentlyReading
            ? "Currently Reading"
            : isFavouriteBooks
              ? "Favourite Books"
              : libraryName}
        </h1>

        {!isCurrentlyReading &&
          !isFavouriteBooks &&
          (isSelectMode ? (
            <div className="absolute top-10 right-6 flex items-center gap-3">
              {/* select all */}
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 ml-2 mb-2 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
          ${
            selectedBooks.size === books.length && books.length > 0
              ? "bg-indigo-500 border-indigo-500"
              : selectedBooks.size > 0
                ? "bg-indigo-200 border-indigo-300" // sebagian dipilih
                : "bg-white border-gray-400"
          }`}
                >
                  {selectedBooks.size === books.length && books.length > 0 ? (
                    <Check size={12} className="text-white" />
                  ) : selectedBooks.size > 0 ? (
                    <Minus size={12} className="text-indigo-500" /> // indeterminate state
                  ) : null}
                </div>
                <span className="text-sm font-medium text-text">
                  {selectedBooks.size === books.length && books.length > 0
                    ? `All selected (${books.length})`
                    : selectedBooks.size > 0
                      ? `${selectedBooks.size} of ${books.length} selected`
                      : "Select All"}
                </span>
              </button>
            </div>
          ) : (
            <MoreButton onSelectBooks={() => setIsSelectMode(true)} />
          ))}

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
      </div>

      {/* Books */}
      <div className="mx-2 grid grid-cols-3 gap-x-3 gap-y-6 px-6 pt-4 items-start">
        {!isSelectMode && !isCurrentlyReading && !isFavouriteBooks && id && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="group cursor-pointer relative aspect-[2/3] w-full rounded-xl border-dark-green/30 bg-light-green/40 flex flex-col items-center justify-center p-3 text-center transition-all duration-200 hover:bg-light-green/70 hover:border-dark-green/60 hover:shadow-sm"
          >
            {/* <div className=" p-2.5 shadow-sm transition-transform duration-200 group-hover:scale-110"> */}
            {/* <BookPlus className="w-5 h-5 text-brown" /> */}
            <PlusCircle className="w-8 h-8 text-dark-green" />
            {/* </div> */}
          </button>
        )}
        {filteredBooks.map((book) =>
          !isCurrentlyReading && !isFavouriteBooks && id ? (
            <BookCardWithMenu
              key={book.id}
              book={book}
              menuItems={[
                {
                  label: "Remove from collection",
                  icon: <Trash2 size={15} />,
                  onClick: () => handleRemoveBook(book.id),
                  variant: "danger",
                },
              ]}
              isSelectMode={isSelectMode}
              isSelected={selectedBooks.has(book.id)}
              onSelect={handleSelect}
            />
          ) : (
            <button
              key={book.id}
              onClick={() => navigate(`/bookDetail/${book.id}`)}
              className="cursor-pointer text-left"
            >
              <BookCover book={book} />
            </button>
          ),
        )}
      </div>

      {id && (
        <AddBookToCollectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          collectionID={Number(id)}
          onSuccess={fetchBooks}
        />
      )}

      {isSelectMode && (
        <div className="fixed bottom-30 left-1/2 z-50 w-80 flex items-center py-4 px-6 max-w-md -translate-x-1/2 rounded-3xl bg-white justify-between">
          <button
            onClick={handleCancelSelect}
            className="text-sm text-gray-500 cursor-pointer"
          >
            Cancel
          </button>

          <span className="text-sm font-medium text-gray-700">
            {selectedBooks.size} selected
          </span>

          <button
            onClick={handleBulkRemove}
            disabled={selectedBooks.size === 0}
            className="text-sm font-medium text-red-500 disabled:opacity-40 cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
