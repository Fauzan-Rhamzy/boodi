import { useState } from "react";
import { useNavigate } from "react-router";
import Onboarding1 from "../components/Onboarding1";
import Onboarding2 from "../components/Onboarding2";
import Onboarding3 from "../components/Onboarding3";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [<Onboarding1 />, <Onboarding2 />, <Onboarding3 />];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handleSignUp = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full  flex-col bg-brown p-2">
      {/* Indicator */}
      <div className="flex gap-1 px-10 pt-15">
        {pages.map((_, index) => (
          <div
            key={index}
            className={
              index === currentPage
                ? "h-2 w-14 rounded-full bg-light-green"
                : "h-2 w-2 rounded-full bg-white"
            }
          />
        ))}
      </div>

      {/* Current onboarding content */}
      <div className="flex flex-1">{pages[currentPage]}</div>

      {/* Buttons */}
      {currentPage < 2 ? (
        //skip next button for first 2 pages
        <div className="flex items-center justify-between px-6 pb-8">
          <button
            onClick={handleLogin}
            className="text-lg font-medium text-white"
          >
            Skip
          </button>

          <button
            onClick={handleNext}
            className="rounded-full bg-white px-10 py-3 text-lg font-semibold text-brown"
          >
            Next
          </button>
        </div>
      ) : (
        // last page button
        <div className="flex flex-col gap-3 px-6 text-xl  pb-8">
          <button
            onClick={handleSignUp}
            className="w-full rounded-full bg-white py-2 font-semibold text-brown"
          >
            Register
          </button>

          <button
            onClick={handleLogin}
            className="py-3 font-semibold text-white"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}
