import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface BackArrowProps {
  backPath?: string;
}

export default function BackArrow({ backPath = "/" }: BackArrowProps) {
  const navigate = useNavigate();
  return (
    <div className="absolute top-10">
      <button
        type="button"
        onClick={() => navigate(backPath)}
        className="flex items-center justify-center text-gray-700 hover:text-black transition-colors duration-200 hover:cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft className="" />
      </button>
    </div>
  );
}
