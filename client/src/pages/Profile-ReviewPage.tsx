import { useEffect, useState } from "react";
import { getMe } from "../features/auth/api";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import type { User } from "../types/users";
import bgProfile from "../assets/bg-profile.png";
import { getUserProfile } from "../api/users";

export default function ProfileReviewsPage() {
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
        className="w-full min-h-screen relative pb-10"
        style={{
            backgroundImage: `url(${bgProfile})`,
            backgroundSize: "100% auto",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top center",
      }}>

        <div>
            <ProfileHeader user={user} />
        </div>

        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 bg-white">
            <Navbar />
        </div>
    </div>
  );
}