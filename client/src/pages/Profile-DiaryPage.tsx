import { useEffect, useState } from "react";
import { getMe } from "../features/auth/api";
import ProfileHeader from "../components/ProfileHeader";
import type { User } from "../types/users";
import bgProfile from "../assets/bg-profile.png";
import { getUserProfile } from "../api/users";

export default function ProfileDiaryPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getMe();
        console.log("ME:", user);
        const fullProfile = await getUserProfile(user.user_id);
        console.log("FULL PROFILE:", fullProfile);
        setUser(fullProfile);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);

  return (
    <div
      className="w-full min-h-screen relative pb-24 bg-bw">
      <div>
        <ProfileHeader user={user} />
      </div>
    </div>
  );
}
