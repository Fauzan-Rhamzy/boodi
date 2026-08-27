import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { getCollections, addBookToCollection } from "../api/collection";
import type { Collection } from "../types/collection";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookID: number;
}

export default function AddToCollectionModal({
  isOpen,
  onClose,
  bookID,
}: Props) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingID, setAddingID] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    getCollections()
      .then(setCollections)
      .catch(() => toast.error("Failed to load collections"));
  }, [isOpen]);

  const handleAdd = async (collectionID: number) => {
    setAddingID(collectionID);
    try {
      await addBookToCollection(collectionID, bookID);
      toast.success("Book added to collection!");
      onClose();
    } catch (err: any) {
      const message = err.response?.data || "";
      if (message.includes("already")) {
        toast.error("Book already in this collection");
      } else {
        toast.error("Failed to add book");
      }
    } finally {
      setAddingID(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold">Add to Collection</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* list koleksi */}
          <div className="max-h-80 overflow-y-auto">
            {collections.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 text-sm">No collections yet</p>
              </div>
            ) : (
              collections.map((collection) => (
                <button
                  key={collection.collection_id}
                  onClick={() => handleAdd(collection.collection_id)}
                  disabled={addingID === collection.collection_id}
                  className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {/* cover photo */}
                  {collection.cover_photo ? (
                    <img
                      src={`http://localhost:8080/images/${collection.cover_photo}`}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                  )}

                  <span className="text-sm font-medium text-left flex-1">
                    {collection.name}
                  </span>

                  {addingID === collection.collection_id && (
                    <span className="text-xs text-gray-400">Adding...</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
