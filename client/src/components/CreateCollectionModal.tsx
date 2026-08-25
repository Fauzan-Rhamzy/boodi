import { useState } from "react";
import { X } from "lucide-react";
import { createCollection } from "../api/collection";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCollectionModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleClose = () => {
    setName("");
    setFile(null);
    setPreview(null);
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Collection name is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (file) {
      formData.append("cover_photo", file);
    }

    try {
      await createCollection(formData);
      toast.success("Collection created!");
      onSuccess();
      handleClose();
    } catch {
      toast.error("Failed to create collection");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
          {/* header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">New Collection</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* cover photo */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="aspect-square w-full rounded-xl bg-gray-100 overflow-hidden cursor-pointer flex items-center justify-center"
                onClick={() =>
                  document.getElementById("collectionCover")?.click()
                }
              >
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <p className="text-xs text-gray-400 text-center px-2">
                    Tap to add cover
                  </p>
                )}
              </div>
              <input
                id="collectionCover"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() =>
                  document.getElementById("collectionCover")?.click()
                }
                className="text-sm text-indigo-500 hover:text-indigo-400 cursor-pointer"
              >
                {preview ? "Change cover" : "Add cover photo"}
              </button>
            </div>

            {/* nama koleksi */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fantasy, Must Read..."
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            {/* buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/2 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-md bg-dark-green text-white text-sm font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
