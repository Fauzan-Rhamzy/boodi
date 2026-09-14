import { useState, useRef, useEffect } from "react";
import { X, Search } from "lucide-react";

export type SelectOption = {
  id: number;
  name: string;
};

interface Props {
  label: string;
  placeholder?: string;
  options: SelectOption[]; // semua data dari API
  selected: SelectOption[]; // yang sudah dipilih
  onSelect: (option: SelectOption) => void;
  onRemove: (id: number) => void;
  onAddNew?: (name: string) => void; // opsional — kalau admin bisa tambah baru
}

export default function MultiSelectSearch({
  label,
  placeholder = "Search...",
  options,
  selected,
  onSelect,
  onRemove,
  onAddNew,
}: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedIDs = new Set(selected.map((s) => s.id));

  // filter — exclude yang sudah dipilih
  const filtered = options.filter(
    (o) =>
      o.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedIDs.has(o.id),
  );

  // cek apakah query exact match dengan yang ada
  const exactMatch = options.some(
    (o) => o.name.toLowerCase() === query.toLowerCase(),
  );

  return (
    <div>
      <label className="block text-sm/6 font-bold mb-1">
        {label} <span className="text-red-500 ml-0.5">*</span>
      </label>

      {/* search input + dropdown */}
      <div ref={ref} className="relative">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="bg-transparent text-sm outline-none w-full text-gray-800 placeholder:text-gray-400"
          />
        </div>

        {isOpen && (query || filtered.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 max-h-48 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  {option.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-2.5 text-sm text-gray-400">
                No results
              </div>
            )}

            {/* tambah baru — muncul kalau tidak ada exact match dan onAddNew tersedia */}
            {onAddNew && query.trim() && !exactMatch && (
              <button
                type="button"
                onClick={() => {
                  onAddNew(query.trim());
                  setQuery("");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-dark-green font-medium hover:bg-gray-50 cursor-pointer border-t border-gray-100"
              >
                + Add "{query.trim()}"
              </button>
            )}
          </div>
        )}
      </div>

      {/* selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 mt-2 ml-1">
          {selected.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1 bg-dark-green text-white text-xs px-2 py-1 rounded-full"
            >
              {item.name}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="cursor-pointer hover:opacity-70"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
