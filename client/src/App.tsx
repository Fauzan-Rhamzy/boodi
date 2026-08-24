import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="h-screen scrollbar-hide flex justify-center bg-gray-300">
      <div className="relative scrollbar-hide w-full max-w-md min-h-screen bg-bw shadow-xl overflow-x-hidden">
        <Toaster />
        <Outlet />
      </div>
    </div>
  );
}
