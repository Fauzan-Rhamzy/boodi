import { useState } from "react";
import { useNavigate } from "react-router";
import type { User } from "../types/user";

type ProfileHeaderProps = {
    user: User
}

export default function ProfileHeader({
    user
}: ProfileHeaderProps) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Books");
    const tabs = ["Books", "Reviews", "Reading Diary"];
    
    return (
        <div className="w-full">
            <div className="flex items-center gap-3 px-6 mt-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {user.profilePic}
                </div>

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">{`${user.firstName} ${user.lastName}`.trim()}</h1>
                <div className="flex items-center gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded-full transition">
                    Edit Profile
                    </button>
                    <span className="text-sm text-gray-600">Joined since '{user.joinedDate.slice(2,4)}</span>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-around border-b border-gray-200 mt-6 px-4">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold transition ${
                    activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-800"
                    }`}
                >
                    {tab}
                </button>
                ))}
            </div>
        </div>
    )
}