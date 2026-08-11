import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { searchBooks, type Book } from "../api/books";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!query) {
      return;
    }
    searchBooks(query).then((data) => {
      setBooks(data);
    });
  }, [query]);

  return (
    <div>
      <h1>Results for {query}</h1>
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-lg font-bold text-gray-700">No books found</p>

          <p className="mt-1 text-sm text-gray-500">
            No book with that title was found.
          </p>
        </div>
      ) : (
        <div>
          {books.map((book) => (
            <div key={book.id}>{book.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
