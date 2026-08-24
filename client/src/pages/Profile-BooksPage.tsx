import { useEffect, useState } from "react";
import { getMe } from "../features/auth/api";
import ProfileHeader from "../components/ProfileHeader";
import type { User } from "../types/users";
import { getUserProfile } from "../api/users";
import type { Book } from "../types/book";
import { getCurrentlyReading, getFavouriteBooks } from "../api/collection";
import HorizontalBookList from "../components/HorizontalBookList";
import { useNavigate } from "react-router";
import type { FavouriteBooks } from "../types/collection";
import { ArrowRight } from "lucide-react";

export default function ProfileBooksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [favouriteBooks, setFavouriteBooks] = useState<FavouriteBooks[]>([]);
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

    async function fetchCurrentlyReading() {
      try {
        const books = await getCurrentlyReading();
        setCurrentlyReading(books);
      } catch (error) {
        console.error("Failed to get currently reading:", error);
      }
    }

    fetchCurrentlyReading();

    async function fetchFavourite() {
      try {
        const books = await getFavouriteBooks();
        setFavouriteBooks(books);
      } catch (error) {
        console.error("Failed to get favourite books:", error);
      }
    }

    fetchFavourite();
  }, []);
  
  return (
    <div className="w-full min-h-screen relative pb-24 bg-bw">
      <div>
        <ProfileHeader user={user} />
      </div>

      <div className="px-4 relative z-10">
        <div className="mx-0.5">
          {/* currently reading */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-text font-bold text-xl">Currently Reading</p>
              <button
                className="flex items-center gap-1 text-md text-dark-green"
                onClick={() => {
                  setTimeout(() => {
                    navigate("/currently-reading");
                  }, 150);
                }}
              >
                See all
                <ArrowRight className="h-4 w-4" />
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
              <p className="text-text font-bold text-xl">Favourite Books</p>
              <button
                className="flex items-center gap-1 text-md text-dark-green"
                onClick={() => {
                  setTimeout(() => {
                    navigate("/favourite-books");
                  }, 150);
                }}
              >
                See all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {favouriteBooks.length > 0 ? (
              <HorizontalBookList
                title="Favourite Books"
                books={favouriteBooks}
              />
            ) : (
              <p className="mt-3 text-sm text-gray-500">add a new book~</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}