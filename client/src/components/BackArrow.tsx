import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface BackArrowProps {
  useHistory?: boolean;
  backPath?: string;
}

export default function BackArrow({ useHistory = false, backPath = "/" }: BackArrowProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (useHistory && window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(backPath);
    }
  };

  return (
    <div className="absolute top-10">
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center justify-center text-gray-700 hover:text-black transition-colors duration-200 hover:cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft className="" />
      </button>
    </div>
  );
}
