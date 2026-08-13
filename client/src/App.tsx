import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="h-screen scrollbar-hide flex justify-center bg-gray-300">
      <div className="relative scrollbar-hide w-97.5 h-screen bg-white">
        <Toaster />
        <Outlet />
      </div>
    </div>
  );
}
