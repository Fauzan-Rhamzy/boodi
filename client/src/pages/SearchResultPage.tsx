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
      {books.map((book) => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <p>{book.cover}</p>
        </div>
      ))}
    </div>
  );
}
