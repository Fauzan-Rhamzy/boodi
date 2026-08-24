import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="h-screen scrollbar-hide flex justify-center">
      <div className="relative scrollbar-hide w-full max-w-md min-h-screen bg-bw shadow-xl overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
