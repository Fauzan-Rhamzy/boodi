import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackArrow from "../components/BackArrow";
import { Add, SortAlphaDownAlt, SortAlphaUpAlt } from "../components/Icons";
import { getCollections } from "../api/collection";
import type { Collection } from "../types/collection";
import CreateCollectionModal from "../components/CreateCollectionModal";
import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  BookMarkedIcon,
} from "lucide-react";
import CollectionSearchBar from "../components/CollectionSearchBar";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alphabetSort, setAlphabetSort] = useState<"az" | "za">("az");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // State to track which collection's menu is currently open
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  async function fetchCollections() {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.error("Failed to get collections:", error);
    }
  }

  // Close dropdown menu if you click anywhere else on the page
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    fetchCollections();
  }, []);

  const filteredCollections = [...collections]
    .sort((a, b) =>
      alphabetSort === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    )
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Toggle dropdown logic
  const handleMenuToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Stops the grid cell click event from firing
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (id: string) => {
    // console.log("edit collection:", id);
  };

  const handleDelete = (id: string) => {
    // console.log("delete collection:", id);
  };

  const COLLECTION_ROUTES: Record<string, string> = {
    Favorite: "/favourite-books",
    "Currently Reading": "/currently-reading",
  };

  return (
    <div className="w-full h-screen overflow-y-auto p-10 pb-36 bg-bw">
      <div className=" pb-4">
        <h1 className="mb-3 ml-2 pb-2 header-style">Library</h1>
        <div className="ml-2 flex items-center gap-2.5">
          {/* Alphabet sorting */}
          <button
            type="button"
            onClick={() =>
              setAlphabetSort((current) => (current === "az" ? "za" : "az"))
            }
            className="rounded-full border-2 p-1 transition-colors hover:bg-gray-200"
          >
            {alphabetSort === "az" ? (
              <SortAlphaDownAlt className="h-5 w-5" />
            ) : (
              <SortAlphaUpAlt className="h-5 w-5" />
            )}
          </button>

          {/* Add */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer"
          >
            <Add className="h-8 w-8" />
          </button>

          {/* Search Toggle */}
          <button
            type="button"
            onClick={() =>
              setIsSearchOpen((prev) => {
                const nextState = !prev;
                if (!nextState) {
                  setSearchQuery("");
                }
                return nextState;
              })
            }
            className={`cursor-pointer border-2 p-0.5 rounded-4xl ${isSearchOpen ? "bg-gray-200 border-gray-400" : ""}`}
          >
            <Search className="h-6 w-6" />
          </button>
        </div>
        {isSearchOpen && (
          <div className="mt-4 mx-2">
            <CollectionSearchBar onSearch={(query) => setSearchQuery(query)} />
          </div>
        )}
      </div>

      {filteredCollections.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-10 py-10 text-center">
          <p className="text-lg font-bold text-gray-700">No collections yet</p>
          <p className="mt-1 text-sm text-gray-500">Add a collection</p>
        </div>
      ) : (
        <div className="mx-2 grid grid-cols-2 gap-x-3 gap-y-6 pt-4">
          {filteredCollections.map((collection: Collection) => {
            const specialRoute = collection.is_system
              ? COLLECTION_ROUTES[collection.name]
              : undefined;

            return (
              <div
                key={collection.collection_id}
                className="relative flex flex-col group"
              >
                <button
                  onClick={() =>
                    navigate(
                      specialRoute ?? `/library/${collection.collection_id}`,
                    )
                  }
                  className="w-full cursor-pointer text-left focus:outline-none"
                >
                  {/* cover photo collection */}
                  {collection.cover_photo ? (
                    <img
                      src={`http://localhost:8080/images/${collection.cover_photo}`}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="aspect-square w-full rounded-xl bg-light-green flex items-center justify-center">
                      <BookMarkedIcon className="w-25 h-25" />
                    </div>
                  )}
                </button>

                {/* Title & Actions Row */}
                <div className="relative mt-1 flex items-center justify-between gap-1 pl-1">
                  <button
                    onClick={() =>
                      navigate(
                        specialRoute ?? `/library/${collection.collection_id}`,
                      )
                    }
                    className="flex-1 text-left cursor-pointer focus:outline-none"
                  >
                    <p className="line-clamp-2 text-[11px] font-medium text-gray-800 leading-snug">
                      {collection.name}
                    </p>
                  </button>

                  {/* Three Dots Trigger Button */}
                  {!collection.is_system && (
                    <button
                      type="button"
                      onClick={(e) =>
                        handleMenuToggle(e, collection.collection_id)
                      }
                      className="p-0.5 -mr-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  )}

                  {/* Action Dropdown Menu */}
                  {activeMenuId === collection.collection_id && (
                    <div
                      className="absolute right-0 top-8 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20"
                      onClick={(e) => e.stopPropagation()} // Prevents closing menu when clicking menu background
                    >
                      <button
                        type="button"
                        onClick={() => {
                          handleEdit(collection.collection_id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100 text-left cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleDelete(collection.collection_id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCollections}
      />

      <div className="h-24 w-full block md:hidden" />
    </div>
  );
}
