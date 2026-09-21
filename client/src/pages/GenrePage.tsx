import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import BackArrow from "../components/BackArrow";
import { ArrowDownAz, ArrowDownZa } from "lucide-react";
import SearchBar from "../components/SearchBar";
import type { Book } from "../types/book";
import { getGenreBooks, getGenreByID } from "../api/genre";
import BookCover from "../components/BookCover";
import type { Genre } from "../types/genre";

export default function GenrePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { genreID } = useParams();
  const [genre, setGenre] = useState<Genre>();
  const [genreBooks, setGenreBooks] = useState<Book[]>([]);

  async function fetchGenreBooks() {
    try {
      if (!genreID) return;

      const data = await getGenreBooks(Number(genreID));
      setGenreBooks(data);

      // setLibraryName(data.name);
      // setBooks(data.books);
    } catch (error) {
      console.error("Failed to get library books:", error);
    }
  }

  async function fetchGenre() {
    if (!genreID) return;
    try {
      const genre = await getGenreByID(Number(genreID));
      setGenre(genre);
    } catch (error) {}
  }

  useEffect(() => {
    fetchGenreBooks();
    fetchGenre();
  }, [genreID]);

  const [searchQuery, setSearchQuery] = useState("");

  // Alphabet sorting
  const [alphabetSort, setAlphabetSort] = useState<"az" | "za">("az");

  // Which type of sorting is currently being used
  const [activeSort, setActiveSort] = useState<"alphabet" | "calendar">(
    "alphabet",
  );

  const sortedBooks = [...genreBooks].sort((a, b) =>
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

        <h1 className="mb-3 ml-2 pt-20 pb-1 text-3xl text-text font-bold">
          {genre?.name || "No Genre Name"}
        </h1>

        {/* Buttons */}
        <div className="ml-2 flex gap-2.5 pb-1 items-center">
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
        {filteredBooks.map((book: Book) => (
          <button
            key={book.id}
            onClick={() => navigate(`/bookDetail/${book.id}`)}
            className="cursor-pointer text-left"
          >
            <BookCover book={book} />
          </button>
        ))}
      </div>
    </div>
  );
}
