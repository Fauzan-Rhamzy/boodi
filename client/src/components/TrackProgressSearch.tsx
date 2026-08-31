import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import type { Book } from "../types/book";
import { searchBooks } from "../api/books";

type TrackProgressSearchProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
};

export default function TrackProgressSearch({
  isOpen,
  onClose,
  onSelectBook,
}: TrackProgressSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

//   buat reset search 
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setBooks([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !searchQuery.trim()) {
      setBooks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchBooks = async () => {
      try {
        const data = await searchBooks(searchQuery);
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooks([]);
      } finally {
        setIsLoading(false); 
      }
    };

    const timer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  const handleCloseAll = () => {
    setSearchQuery("");
    setBooks([]);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={handleCloseAll}
      />

      <div className="relative w-full max-w-md h-[70vh] bg-white rounded-t-[32px] p-4 z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-4" />
          <h2 className="text-xl font-bold text-text">Select Book</h2>
          <button
            type="button"
            onClick={handleCloseAll}
            className="p-1 text-text cursor-pointer hover:opacity-70 transition-opacity"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-center pb-2">
          <SearchBar
            className="mt-1 mb-3 w-full"
            onSearch={(query) => setSearchQuery(query)}
          />
        </div>

        {/* Result Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {!searchQuery.trim() ? (
            // kalau belum ngetik
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <p className="text-sm font-medium text-brown/60">
                Type a book title to search...
              </p>
            </div>
            // kalau udah ngetik, ambil result selama 300s
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-brown/60 mb-2" />
              <p className="text-xs text-brown/60">Searching books...</p>
            </div>
            // keluarin hasil search kalau gaada hasilnya 
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <p className="text-base font-bold text-brown">No books found</p>
              <p className="mt-1 text-xs text-brown/50">
                No book with that title was found.
              </p>
            </div>
          ) : (
            // keluarin hasil kalau ada hasilnya 
            <div className="grid grid-cols-3 gap-x-3 gap-y-4 px-2 pt-2 items-start">
              {books.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => {
                    onSelectBook(book);
                    handleCloseAll();
                  }}
                  className="cursor-pointer text-left flex flex-col items-center group transition-transform active:scale-95"
                >
                  <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md border border-gray-100 transition-all">
                    <img
                      src={`http://localhost:8080/images/${book.cover}`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}