import { Search, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const search = () => {
    if (!query.trim()) {
      setError("Please insert a book title!");
      return;
    }

    setError("");
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };
  return (
    <div className="flex flex-col">
      <div className="flex h-10 w-86 items-center justify-between rounded-4xl bg-[#F1E7F8]/30 px-5 shadow-lg ring-2 ring-black/5">
        <input
          value={query}
          placeholder="Search a book title..."
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          className="text-md focus:border-none focus:outline-none w-full text-gray-600 border-0"
        ></input>
        <button onClick={search}>
          <Search className="h-5 w-5 text-gray-800" />
        </button>
      </div>
      {error && (
        <div className="flex  items-center gap-2 mx-2 mt-2 text-sm text-red-500 font-bold bg-red-50 rounded-lg border-2 p-0.5 px-2">
          <TriangleAlert className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
