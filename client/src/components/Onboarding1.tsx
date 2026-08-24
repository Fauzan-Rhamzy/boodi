// Onboarding1.tsx

import onboarding1 from "../assets/onboarding1.png";

export default function Onboarding1() {
  return (
    <div className="flex flex-1 flex-col gap-4 items-center justify-center">
      <h1 className="font-caveat text-white text-6xl">Welcome to</h1>
      <h1 className="font-sans font-bold text-white text-8xl">BooDi</h1>
      <div className="bg-dark-green px-20 rounded-2xl">
        <p className="text-white">Book Diary</p>
      </div>
      <img src={onboarding1} alt="Welcome to BooDi" className="w-2/3 pt-7" />
    </div>
  );
}
