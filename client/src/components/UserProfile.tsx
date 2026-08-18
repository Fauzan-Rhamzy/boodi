import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../features/auth/AuthContext";
import toast from "react-hot-toast";

export default function UserProfile({ pfp }: { pfp: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { logout } = useAuth();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.success("You've been logged out");
  };
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 cursor-pointer"
      >
        <img
          src={
          user?.profile_picture
            ? `http://localhost:8080/images/${user.profile_picture}`
            : `http://localhost:8080/images/profile/dummy.png`
        }
          className="w-10 h-10 rounded-full object-cover"
        />
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-100 ">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit Profile
          </button>
          <button
            onClick={() => handleLogout()}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
