import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { User } from "../types/users";
import BackArrow from "./BackArrow";

type ProfileHeaderProps = {
    user: User | null;
}

export default function ProfileHeader({
    user
}: ProfileHeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { label: "Books", path: "/profile" },
        { label: "Reviews", path: "/profile/reviews" },
        { label: "Reading Diary", path: "/profile/diary" },
    ];

    return (
        <div className="w-full">
            <div className="w-full flex justify-start items-center gap-3 px-10">
                    <div className="shrink-0">
                        <BackArrow useHistory={true} backPath="/" />
                    </div>

                    <img
                        src={
                        user?.profile_pic
                            ? `http://localhost:8080/images/${user.profile_pic}`
                            : `http://localhost:8080/images/profile/dummy.png`
                        }
                        alt={user?.first_name}
                        className="w-14 h-14 rounded-full object-cover shrink-0 mt-20"
                    />

                    <div>


                        <div className="flex flex-col gap-1 mt-20">
                            <h1 className="text-xl font-bold text-gray-900">{`${user?.first_name} ${user?.last_name}`}</h1>
                            <div className="flex items-center gap-2">
                                <button 
                                onClick={() => navigate("/profile/edit")}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded-full transition">
                                Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
            </div>

        {/* Tabs */}
        <div className="w-full mt-6">
            <div className="flex justify-start items-center gap-4 ml-6">
                {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                    <button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    className={`px-3 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                        isActive
                        ? "bg-[#6750A4] text-white"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    >
                    {tab.label}
                    </button>
                );
                })}
            </div>
            </div>
        </div>
    )
}