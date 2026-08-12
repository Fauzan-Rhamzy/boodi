import { useNavigate } from "react-router";
import type { Book } from "../types/book";

type BookCoverProps = {
  book: Book;
  className?: string;
};

export default function BookCover({ book, className = "" }: BookCoverProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/bookDetail/${book.id}`)}
      className={`cursor-pointer text-left ${className}`}
    >
      <img
        src={`http://localhost:8080/images/${book.cover}`}
        alt={book.title}
        className="aspect-2/3 w-full rounded-xl object-cover"
      />
    </button>
  );
}
