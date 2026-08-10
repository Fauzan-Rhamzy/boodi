import { ArrowLeft } from "lucide-react";

export default function BackArrow() {
  return (
    <div className="absolute top-10 left-6">
      <button
        type="button"
        className="flex items-center justify-center p-2 text-gray-700 hover:text-black transition-colors duration-200"
        aria-label="Go back"
      >
        <ArrowLeft className="" />
      </button>
    </div>
  );
}
