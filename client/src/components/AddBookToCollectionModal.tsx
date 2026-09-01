import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { addBookToCollection } from "../api/collection";
import { searchBooks } from "../api/books";
import type { Book } from "../types/book";
import BookCover from "./BookCover";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  collectionID: number;
  onSuccess: () => void;
}

export default function AddBookToCollectionModal({
  isOpen,
  onClose,
  collectionID,
  onSuccess,
}: Props) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingID, setAddingID] = useState<number | null>(null);

  // search buku setiap query berubah
  useEffect(() => {
    if (!isOpen) return;
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchBooks(query);
        setBooks(data);
      } catch {
        toast.error("Failed to search books");
      } finally {
        setLoading(false);
      }
    }, 400); // debounce 400ms — tidak fetch setiap ketikan

    return () => clearTimeout(timeout);
  }, [query, isOpen]);

  const handleClose = () => {
    setQuery("");
    setBooks([]);
    onClose();
  };

  const handleAdd = async (bookID: number) => {
    setAddingID(bookID);
    try {
      await addBookToCollection(collectionID, bookID);
      toast.success("Book added!");
      onSuccess();
      handleClose();
    } catch (err: any) {
      const message = err.response?.data || "";
      if (message.includes("already")) {
        toast.error("Book already in this collection");
      } else {
        toast.error("Failed to add book");
      }
    } finally {
      setAddingID(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold">Add a Book</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* search input */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books..."
                className="bg-transparent text-sm outline-none w-full text-gray-800 placeholder:text-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* hasil search */}
          <div className="max-h-80 overflow-y-auto">
            {/* belum ada query */}
            {!query.trim() && (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-gray-400">
                  Type to search for a book
                </p>
              </div>
            )}

            {/* loading */}
            {loading && (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-gray-400">Searching...</p>
              </div>
            )}

            {/* tidak ada hasil */}
            {!loading && query.trim() && books.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-gray-400">No books found</p>
              </div>
            )}

            {/* list buku */}
            {!loading &&
              books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => handleAdd(book.id)}
                  disabled={addingID === book.id}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 text-left"
                >
                  <div className="w-10 h-14 shrink-0">
                    <BookCover
                      book={book}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {book.title}
                    </p>
                    {book.authors && book.authors.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        {book.authors[0].name}
                      </p>
                    )}
                  </div>

                  {addingID === book.id && (
                    <span className="text-xs text-gray-400 shrink-0">
                      Adding...
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
