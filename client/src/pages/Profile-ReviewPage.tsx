import { useEffect, useState } from "react";
import { getMe } from "../features/auth/api";
import ProfileHeader from "../components/ProfileHeader";
import type { User } from "../types/users";
import { getUserProfile } from "../api/users";
import SearchBar from "../components/SearchBar";
import TrendingReviewCard from "../components/TrendingReviewCard";

export default function ProfileReviewsPage() {
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <div className="w-full min-h-screen relative pb-24 bg-bw">
      <div className="flex flex-col gap-3 justify-center items-center">
        <ProfileHeader user={user} />
        <SearchBar className="w-8/10"></SearchBar>
      </div>
      <div className="mt-6 pb-30">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xl font-bold">Trending Review</p>
        </div>
        {trendingReviews.map((review) => (
          <TrendingReviewCard key={review.review_id} review={review} />
        ))}
      </div>
    </div>
  );
}
