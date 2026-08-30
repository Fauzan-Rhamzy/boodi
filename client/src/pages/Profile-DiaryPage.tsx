import { useCallback, useEffect, useState } from "react";
import { getMe } from "../features/auth/api";
import ProfileHeader from "../components/ProfileHeader";
import type { User } from "../types/users";
import { getUserProfile, trackBookProgress } from "../api/users";
import { Plus } from "lucide-react";
import TrackProgressPopUp from "../components/TrackProgressPopUP";
import TrackProgressSearch from "../components/TrackProgressSearch";
import type { Book } from "../types/book";
import toast from "react-hot-toast";
import { getById } from "../api/books";

export default function ProfileDiaryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handleOpenTrackMain = () => {
    setSelectedBook(null); 
    setIsTrackOpen(true);
  };

  const handleSelectBook = async (book: Book) => {
  try {
    const fullBook = await getById(book.id);
    setSelectedBook(fullBook);
  } catch (error) {
    setSelectedBook(book);
  } finally {
    setIsSearchOpen(false);
    setIsTrackOpen(true);
  }
};

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

      {/* buat siapapun yang ngerjain, nanti tinggal ganti warna, posisi, bentuk, etc 
      <button 
        onClick={handleOpenTrackMain}
        className="text-sm flex items-center gap-1 bg-text text-white font-medium px-3 py-1 rounded-lg transition">
          <Plus className="w-6 h-6" />
          <span className="text-md">Add Session</span>
      </button> */}

      <TrackProgressPopUp
        isOpen={isTrackOpen}
        initialBook={selectedBook}
        onClose={() => setIsTrackOpen(false)}
        onSave={handleSave}
        onOpenSearch={() => {
          setIsTrackOpen(false);  
          setIsSearchOpen(true);  
        }}
      />

      <TrackProgressSearch
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setIsTrackOpen(true); 
        }} 
        onSelectBook={handleSelectBook}
      />
    </div>
  );
}
