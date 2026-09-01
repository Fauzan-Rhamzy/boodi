import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onSelectBooks?: () => void;
  onDeleteCollection?: () => void;
}

export default function MoreButton({
  onSelectBooks,
  onDeleteCollection,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={ref} className="absolute top-10 right-6">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center text-text hover:text-brown transition-colors duration-200 hover:cursor-pointer"
      >
        <MoreVertical className="w-6 h-6 text-text" strokeWidth={2.5} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  onSelectBooks?.();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-sm text-brown hover:bg-gray-100 cursor-pointer"
              >
                Select Books
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onDeleteCollection?.();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              >
                Delete from Library
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
