import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const search = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <div className="flex h-10 w-86 items-center justify-between rounded-4xl bg-[#F1E7F8]/30 px-5 shadow-lg ring-2 ring-black/5">
      <input
        value={query}
        placeholder="Search a book title..."
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        className="text-md text-gray-600 border-0"
      ></input>
      <button onClick={search}>
        <Search className="h-5 w-5 text-gray-800" />
      </button>
    </div>
  );
}
