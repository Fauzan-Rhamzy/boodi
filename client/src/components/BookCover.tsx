import { Link, useNavigate } from "react-router";
import type { Book } from "../types/book";

type BookCoverProps = {
  book: Pick<Book, "id" | "title" | "cover">;
  className?: string;
};

export default function BookCover({ book, className = "" }: BookCoverProps) {
  return (
    <Link
      to={`/bookDetail/${book.id}`}
      className={`block w-full cursor-pointer text-left ${className}`}
    >
      <div className="overflow-hidden rounded-xl w-full">
        <img
          src={`http://localhost:8080/images/${book.cover}`}
          alt={book.title}
          className="aspect-[2/3] w-full object-cover"
        />
      </div>
    </Link>
  );
}
