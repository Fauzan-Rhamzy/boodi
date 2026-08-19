import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BackArrow from "../components/BackArrow";
import bgLibrary from "../assets/bg-library.png";
import { Add, SortAlphaDownAlt, SortAlphaUpAlt } from "../components/Icons";
import SearchBar from "../components/SearchBar";
import { getCollections } from "../api/collection";
import type { Collection } from "../types/collection";
import CreateCollectionModal from "../components/CreateCollectionModal";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alphabetSort, setAlphabetSort] = useState<"az" | "za">("az");

  async function fetchCollections() {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.error("Failed to get collections:", error);
    }
  }

  useEffect(() => {
    fetchCollections();
    console.log(collections);
  }, []);

  const filteredCollections = [...collections]
    .sort((a, b) =>
      alphabetSort === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    )
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundImage: `url(${bgLibrary})` }}
    >
      <div className="px-6 pt-3 pb-2">
        <BackArrow useHistory={true} />

        <h1 className="mb-3 ml-2 pt-20 text-3xl font-bold">Library</h1>

        <div className="ml-2 flex items-center gap-2.5">
          {/* Add */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer"
          >
            <Add className="h-8 w-8" />
          </button>

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
        </div>

        <SearchBar
          className="mt-4 w-full"
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      {filteredCollections.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-10 py-10 text-center">
          <p className="text-lg font-bold text-gray-700">No collections yet</p>
          <p className="mt-1 text-sm text-gray-500">Add a collection</p>
        </div>
      ) : (
        <div className="mx-2 grid grid-cols-2 gap-x-3 gap-y-6 px-6 pt-4">
          {filteredCollections.map((collection) => (
            <button
              key={collection.collection_id}
              onClick={() => navigate(`/library/${collection.collection_id}`)}
              className="cursor-pointer text-left"
            >
              {/* cover photo collection */}
              {collection.cover_photo ? (
                <img
                  src={`http://localhost:8080/images/${collection.cover_photo}`}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-xl bg-gray-200" />
              )}
              <p className="mt-1 line-clamp-2 text-sm font-medium">
                {collection.name}
              </p>
            </button>
          ))}
        </div>
      )}
      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCollections}
      />
    </div>
  );
}
