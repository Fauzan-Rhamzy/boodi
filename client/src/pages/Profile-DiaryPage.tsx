import { useCallback, useEffect, useMemo, useState } from "react";
import { getMe } from "../features/auth/api";
import ProfileHeader from "../components/ProfileHeader";
import type { User } from "../types/users";
import { getUserProfile, trackBookProgress } from "../api/users";
import { Plus } from "lucide-react";
import TrackProgressPopUp from "../components/TrackProgressPopUP";
import type { Book } from "../types/book";
import toast from "react-hot-toast";

export default function ProfileDiaryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getMe();
        const fullProfile = await getUserProfile(user.user_id);
        setUser(fullProfile);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);

  const memoizedInitialBook = useMemo(() => {
    if (!book) return null;

    return {
      id: book.id,
      title: book.title,
      cover: book.cover,
      current_page: currentPage, 
    };
  }, [book?.id, book?.title, book?.cover, currentPage]);

  const handleSave = useCallback(async (data: { book_id: number; pages_read: number; read_date: string }) => {
    const loading = toast.loading("Saving progress...");

    try {
      await trackBookProgress(data.book_id, data.pages_read, data.read_date);
      setCurrentPage(data.pages_read);
      toast.dismiss(loading);
      toast.success("Track updated!");
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to track book update");
      throw error;
    }
  }, []);

  return (
    <div
      className="w-full min-h-screen relative pb-24 bg-bw">
      <div>
        <ProfileHeader user={user} />
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-sm flex items-center gap-1 bg-text text-white font-medium px-3 py-1 rounded-lg transition">
          <Plus className="w-6 h-6" />
          <span className="text-md">Track Progress</span>
      </button>

      <TrackProgressPopUp
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialBook={memoizedInitialBook}
        onSave={handleSave}
      />
    </div>
  );
}
