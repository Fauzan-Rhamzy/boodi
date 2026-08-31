import { useCallback, useEffect, useState } from "react";
import { getMe } from "../features/auth/api";
import ProfileHeader from "../components/ProfileHeader";
import type { ReadingSession, User } from "../types/users";
import {
  getReadingSessions,
  getUserProfile,
  trackBookProgress,
} from "../api/users";
import { Plus } from "lucide-react";
import TrackProgressPopUp from "../components/TrackProgressPopUP";
import TrackProgressSearch from "../components/TrackProgressSearch";
import type { Book } from "../types/book";
import toast from "react-hot-toast";
import { getById } from "../api/books";
import DiaryCalendar from "../components/DiaryCalendar";
import DiarySessionCard from "../components/DiarySessionCard";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i);

export default function ProfileDiaryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  // const [sessions, setSessions] = useState<ReadingSession[]>([
  //   {
  //     book_id: 101,
  //     title: "The Midnight Library",
  //     cover: "https://ssl-images-amazon.com",
  //     current_page: 45,
  //     total_pages: 102,
  //     logged_at: `${currentYear}-08-12`, // August 12, 2026
  //   },
  //   {
  //     book_id: 102,
  //     title: "Atomic Habits",
  //     cover: "https://ssl-images-amazon.com",
  //     current_page: 20,
  //     total_pages: 20,
  //     logged_at: `${currentYear}-08-15`, // August 15, 2026
  //   },
  //   {
  //     book_id: 101,
  //     title: "The Midnight Library",
  //     cover: "https://ssl-images-amazon.com",
  //     current_page: 35,
  //     total_pages: 35,
  //     logged_at: `${currentYear}-08-15`, // Two entries on August 15
  //   },
  //   {
  //     book_id: 103,
  //     title: "Dune",
  //     cover: "https://ssl-images-amazon.com",
  //     current_page: 50,
  //     total_pages: 51,
  //     logged_at: `${currentYear}-08-28`, // August 28, 2026
  //   },
  // ]);

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

    async function fetchSessions() {
      try {
        const data = await getReadingSessions(selectedYear, selectedMonth + 1);
        setSessions(data);
      } catch (error) {}
    }

    fetchSessions();
  }, [selectedYear, selectedMonth]);

  const handleSave = useCallback(
    async (data: {
      book_id: number;
      pages_read: number;
      read_date: string;
    }) => {
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
    },
    [],
  );

  const sessionDates = new Set(
    sessions.map((s) => new Date(s.logged_at).getDate()),
  );
  return (
    <div className="w-full min-h-screen relative pb-24 bg-bw">
      <div>
        <ProfileHeader user={user} />
      </div>

      <div className="px-4 pt-4">
        {/* Year & Month dropdown */}
        <div className="flex gap-3 mb-4">
          <div className="flex flex-col">
            <span>Year</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="flex-1 bg-white rounded-xl px-3 py-2 text-sm font-medium text-text border border-gray-200 focus:outline-none cursor-pointer"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <span>Month</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="flex-1 bg-white rounded-xl px-3 py-2 text-sm font-medium text-text border border-gray-200 focus:outline-none cursor-pointer"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DiaryCalendar
          year={selectedYear}
          month={selectedMonth}
          sessionDates={sessionDates}
        />

        <div className="flex items-center justify-between mt-6 mb-3">
          <p className="text-text font-bold text-lg">Sessions</p>
          <button
            onClick={() => {
              setSelectedBook(null);
              setIsTrackOpen(true);
            }}
            className="flex items-center gap-1 bg-dark-green text-white text-sm font-medium px-3 py-1.5 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {sessions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-6">
            No sessions this month
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session, index) => (
              <DiarySessionCard key={index} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* buat siapapun yang ngerjain, nanti tinggal ganti warna, posisi, bentuk, etc  */}

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
