import { useNavigate } from "react-router";
import type { Book } from "../types/book";

type BookCoverProps = {
  book: Pick<Book, "id" | "title" | "cover">;
  className?: string;
};

export default function BookCover({ book, className = "" }: BookCoverProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/bookDetail/${book.id}`)}
      className={`cursor-pointer text-left ${className}`}
    >
      <img
        src={`http://localhost:8080/images/${book.cover}`}
        alt={book.title}
        className="relative aspect-[2/3] w-full rounded-xl object-cover"
      />
    </div>
  );
}
