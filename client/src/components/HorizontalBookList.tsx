import type { Book } from "../types/book";

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

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max gap-4">
          {books.map((book) => (
            <div key={book.id} className="w-28 shrink-0">
              <img
                src={`http://localhost:8080/images/${book.cover}`}
                alt={book.title}
                className="h-40 w-28 rounded-xl object-cover"
              />

              <p className="mt-2 truncate text-sm font-semibold">
                {book.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
