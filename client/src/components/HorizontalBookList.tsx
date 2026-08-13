import type { Book } from "../types/book";
import BookCover from "./BookCover";

type HorizontalBookListProps = {
  title: string;
  books: Book[];
};

export default function HorizontalBookList({
  title,
  books,
}: HorizontalBookListProps) {
  return (
    <section>
      {/* <h2 className="mb-3 text-lg font-bold">{title}</h2> */}

      <div className="overflow-x-auto scrollbar-hide mt-2">
        <div className="flex w-max gap-4">
          {books.map((book) => (
            <div key={book.id} className="w-28  shrink-0">
              <BookCover key={book.id} book={book}></BookCover>
              {
                <p className="mt-1 mx-1 truncate  text-sm font-medium">
                  {book.title}
                </p>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
