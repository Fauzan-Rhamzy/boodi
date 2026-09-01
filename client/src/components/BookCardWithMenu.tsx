import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Check } from "lucide-react"; // ← ganti MoreVertical ke MoreHorizontal
import { useNavigate } from "react-router";
import type { Book } from "../types/book";
import type { ReactNode } from "react";

export type MenuItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
};

interface Props {
  book: Pick<Book, "id" | "title" | "cover">;
  menuItems: MenuItem[];
  isSelectMode?: boolean;
  isSelected?: boolean;
  onSelect?: (bookID: number) => void;
}

export default function BookCardWithMenu({
  book,
  menuItems,
  isSelectMode = false,
  isSelected = false,
  onSelect,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSelectMode) setMenuOpen(false);
  }, [isSelectMode]);

  return (
    <div className="flex flex-col">
      {/* cover buku */}
      <div
        onClick={() => {
          if (isSelectMode) {
            onSelect?.(book.id);
          } else {
            navigate(`/bookDetail/${book.id}`);
          }
        }}
        className="relative cursor-pointer"
      >
        <img
          src={`http://localhost:8080/images/${book.cover}`}
          alt={book.title}
          className={`aspect-[2/3] w-full rounded-xl object-cover transition-opacity
            ${isSelectMode && isSelected ? "opacity-70" : "opacity-100"}`}
        />

        {/* checkbox — muncul di pojok kanan atas saat select mode */}
        {isSelectMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(book.id);
            }}
            className="absolute top-1 right-1 z-10 cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                ${
                  isSelected
                    ? "bg-indigo-500 border-indigo-500"
                    : "bg-white/80 border-gray-400"
                }`}
            >
              {isSelected && <Check size={11} className="text-white" />}
            </div>
          </button>
        )}
      </div>

      {/* bawah cover — titik tiga atau kosong saat select mode */}
      {!isSelectMode && (
        <div ref={menuRef} className="relative flex justify-end mr-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreHorizontal size={18} className="text-black" />
          </button>

          {/* dropdown — muncul ke atas supaya tidak terpotong */}
          {menuOpen && (
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-48">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick();
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm cursor-pointer transition-colors
                    ${
                      item.variant === "danger"
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
