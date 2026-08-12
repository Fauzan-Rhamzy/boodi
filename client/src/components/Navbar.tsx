import { Link, useLocation } from "react-router";
import { Home, LayoutGrid, User } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2">
      <nav className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl rounded-t-3xl py-2 px-8 w-full">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <Link
            to={"/home"}
            className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
              isActive("/home")
                ? "text-pink-500 font-semibold"
                : "hover:text-pink-500"
            }`}
          >
            <Home className="h-6 w-6 stroke-[1.75]" />
            <span className="text-[11px]">Home</span>
          </Link>

          <Link
            to={"/library"}
            className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
              isActive("/library")
                ? "text-pink-500 font-semibold"
                : "hover:text-pink-500"
            }`}
          >
            <LayoutGrid className="h-6 w-6 stroke-[1.75]" />
            <span className="text-[11px]">Library</span>
          </Link>

          <Link
            to={"/profile"}
            className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
              isActive("/profile")
                ? "text-pink-500 font-semibold"
                : "hover:text-pink-500"
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
