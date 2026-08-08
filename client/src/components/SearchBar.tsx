import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex h-10 w-86 items-center justify-between rounded-4xl bg-[#F1E7F8]/30 px-5 shadow-lg ring-2 ring-black/5">
      <p className="text-md text-gray-600">Search a book title...</p>
      <Search className="h-5 w-5 text-gray-800" />
    </div>
  );
}
