import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function BackArrow() {
  const navigate = useNavigate();
  return (
    <div className="absolute top-20">
      <button
        type="button"
        className="flex items-center justify-center text-gray-700 hover:text-black transition-colors duration-200 hover:cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft className="" />
      </button>
    </div>
  );
}
