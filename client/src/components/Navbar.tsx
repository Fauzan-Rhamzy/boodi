import { Link, useLocation } from "react-router";
import { Home, LayoutGrid, Search, User } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2">
      <nav className="bg-[#533113] backdrop-blur-md border shadow-2xl rounded-t-3xl py-2 px-8 w-full">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <Link
            to={"/home"}
            className={` flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
              isActive("/home")
                ? "text-[#FFD49A] font-semibold"
                : "hover:text-[#FFD49A] text-[#fffdfb]"
            }`}
          >
            <Home className="h-6 w-6 stroke-[1.75]" />
            <span className="text-[11px]">Home</span>
          </Link>

          <Link
            to={"/search"}
            className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
              isActive("/search")
                ? "text-[#FFD49A] font-semibold"
                : "hover:text-[#FFD49A] text-[#fffdfb] "
            }`}
          >
            <Search className="h-6 w-6 stroke-[1.75]" />
            <span className="text-[11px]">Search</span>
          </Link>

          <Link
            to={"/library"}
            className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
              isActive("/library")
                ? "text-[#FFD49A] font-semibold"
                : "hover:text-[#FFD49A] text-[#fffdfb] "
            }`}
          >
            <LayoutGrid className="h-6 w-6 stroke-[1.75]" />
            <span className="text-[11px]">Library</span>
          </Link>

          <Link
            to={"/profile"}
            className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
              isActive("/profile")
                ? "text-[#FFD49A] font-semibold"
                : "hover:text-[#FFD49A] text-[#fffdfb] "
            }`}
          >
            <User className="h-6 w-6 stroke-[1.75]" />
            <span className="text-[11px]">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
