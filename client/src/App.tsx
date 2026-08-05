import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen flex justify-center bg-gray-300">
      <div className="w-97.5 min-h-screen bg-white">
        <Outlet />
      </div>
    </div>
  );
}
