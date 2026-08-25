import { Search, CircleX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CollectionSearchBarProps = {
  className?: string;
  onSearch: (query: string) => void; // Made required since local search needs to communicate updates
};

export default function CollectionSearchBar({
  className,
  onSearch,
}: CollectionSearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={className}>
      <div className="flex flex-col">
        <div className="flex h-10 w-full items-center justify-between rounded-4xl bg-white/90 px-5 shadow-lg ring-2 ring-black/5">
          <input
            value={query}
            ref={inputRef}
            placeholder="Search collections..."
            onChange={(event) => handleTextChange(event.target.value)}
            className="text-md w-full border-0 text-dark-green focus:border-none focus:outline-none"
          />

          <button
            type="button"
            onClick={query ? clearSearch : undefined}
            className="focus:outline-none"
          >
            {!query ? (
              <Search className="h-5 w-5 text-dark-green" />
            ) : (
              <CircleX className="h-5 w-5 text-dark-green hover:text-red-500 transition-colors cursor-pointer" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
