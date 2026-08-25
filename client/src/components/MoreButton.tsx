import { MoreVertical } from "lucide-react";
import { useState } from "react";

export default function MoreButton() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

  return (
    <div className="absolute top-10 right-6">
        <button
        onClick={toggleDropdown}
        className="flex items-center justify-center text-text hover:text-brown transition-colors duration-200 hover:cursor-pointer">
            <MoreVertical className="w-6 h-6 text-text" strokeWidth={2.5} />
        </button>

        {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <a href="#addToCollection" className="block px-4 py-2 text-sm text-brown hover:bg-gray-100">
                Add to Collection
              </a>
            </li>
            <li>
              <a href="#deleteBook" className="block px-4 py-2 text-sm text-brown hover:bg-gray-100">
                Delete Books
              </a>
            </li>
            <li>
              <a href="#deleteCollection" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Delete from Library
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}