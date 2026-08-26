import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { User } from "../types/users";
import BackArrow from "./BackArrow";
import "../../index.css"

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
        { label: "Diary", path: "/profile/diary" },
    ];

    return (
        <div className="w-full">
            <div className="w-full flex justify-start items-center gap-4 px-10">
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


                        <div className="flex flex-col gap-2 mt-20">
                            <h1 className="text-xl font-bold text-text">{`${user?.first_name} ${user?.last_name}`}</h1>
                            <div className="flex items-center">
                                <button 
                                onClick={() => {
                                    setTimeout(() => {
                                        navigate("/profile/edit");
                                    }, 70);
                                }}
                                className="bg-dark-green active:bg-light-green active:scale-95 duration:200 text-white text-xs font-medium px-3 py-1 rounded-full transition">
                                Edit Profile
                                </button>

                                <span className="text-sm text-dark-green ml-2 font-semibold">Joined since '{user?.joined_date?.slice(2,4)}</span>
                            </div>
                        </div>
                    </div>
            </div>

        {/* Tabs */}
        <div className="w-full mt-6 px-13">
            <div className="flex justify-between items-center bg-white p-1.5 rounded-full shadow-sm">
                {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                    <button
                    key={tab.path}
                    onClick={() => {
                            setTimeout(() => {
                            navigate(tab.path);
                        }, 70);
                    }}
                    className={`px-3 py-1 rounded-full text-[13px] font-bold transition-colors ${
                        isActive
                        ? "bg-dark-green text-white"
                        : "text-light-brown active:text-brown"
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