import { Search, TriangleAlert, CircleX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

type SearchBarProps = {
  className?: string;
  onSearch?: (query: string) => void;
};

export default function SearchBar({ className, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const search = () => {
    if (!query.trim()) {
      setError("Please insert a book title!");

      return;
    }
    setIsSearching(true);
    setError("");

    if (onSearch) {
      onSearch(query.trim()); //same page search
    } else {
      //reroute to other page for search result
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setError("");
    setIsSearching(false);

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col">
        <div className="flex h-10 w-full items-center justify-between rounded-4xl bg-white/90 px-5 shadow-lg ring-2 ring-black/5">
          <input
            value={query}
            placeholder="Search a book title..."
            onChange={(event) => {
              setQuery(event.target.value);
              setError("");
              setIsSearching(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            className="text-md w-full border-0 text-dark-green focus:border-none focus:outline-none"
          />

          <button type="button" onClick={isSearching ? clearSearch : search}>
            {!isSearching ? (
              <Search className="h-5 w-5 text-dark-green" />
            ) : (
              <CircleX className="h-5 w-5 text-dark-green" />
            )}
          </button>
        </div>

        {error && (
          <div className="mx-2 mt-2 flex items-center gap-2 rounded-lg border-2 bg-red-50 p-0.5 px-2 text-sm font-bold text-red-500">
            <TriangleAlert className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
