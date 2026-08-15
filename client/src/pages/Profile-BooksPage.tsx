import { useEffect, useState } from "react";
import { getMe, type AuthUser } from "../features/auth/api";
import BackArrow from "../components/BackArrow";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/profileHeader";
import { useAuth } from "../features/auth/AuthContext";

export default function ProfileBooksPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Please Login</p>;
    }

  return (
    <div>

        <div className="w-full flex justify-start px-10">
            <BackArrow useHistory={true} backPath="/" />
        </div>

        <div>
            <ProfileHeader user={user} />
        </div>

        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 bg-white">
            <Navbar />
        </div>
    </div>
  );
}