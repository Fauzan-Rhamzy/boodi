import { useEffect, useState } from "react";
import { getMe } from "../features/auth/api";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import type { User } from "../types/users";
import bgProfile from "../assets/bg-profile.png";
import { getUserProfile } from "../api/users";
import type { Book } from "../types/book";
import { getCurrentlyReading } from "../api/collection";
import HorizontalBookList from "../components/HorizontalBookList";
import { ChevronsRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export default function ProfileBooksPage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
    const [currentLibrary, setCurrentLibrary] = useState<Book[]>([]);
    const navigate = useNavigate();

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

        async function fetchCurrentLibrary() {
            try {
                const books = await getCurrentlyReading();
                setCurrentlyReading(books);
            } catch (error) {
                console.error("Failed to get currently reading:", error);
            }
        }
        
        fetchCurrentLibrary();
    }, []);

  return (
    <div 
        className="w-full min-h-screen relative pb-30"
        style={{
            backgroundImage: `url(${bgProfile})`,
            backgroundSize: "100% auto",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top center",
      }}>

        <div>
            <ProfileHeader user={user} />
        </div>

        <div className="mx-6 relative z-10">
            <div className="mx-0.5">
            {/* currently reading */}
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">Currently Reading</p>
                    <button
                        className="flex items-center gap-1 text-md text-gray-500"
                        onClick={() => navigate(`/currently-reading`)}
                    >
                        See all
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                    </div>
                    {currentlyReading.length > 0 ? (
                    <HorizontalBookList
                        title="Currently Reading"
                        books={currentlyReading}
                    />
                    ) : (
                    <p className="mt-3 text-sm text-gray-500">Read a new book~</p>
                    )}
                </div>
            </div>

            <div className="mx-0.5">
            {/* favourite books */}
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">Favourite Books</p>
                    <button
                        className="flex items-center gap-1 text-md text-gray-500"
                        onClick={() => navigate(`/favourite-books`)}
                    >
                        See all
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                    </div>
                    {currentlyReading.length > 0 ? (
                    <HorizontalBookList
                        title="Favourite Books"
                        books={currentlyReading}
                    />
                    ) : (
                    <p className="mt-3 text-sm text-gray-500">add a new book~</p>
                    )}
                </div>
            </div>
        </div>
        
        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 bg-white">
            <Navbar />
        </div>
    </div>
  );
}