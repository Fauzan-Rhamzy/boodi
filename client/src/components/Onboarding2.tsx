// Onboarding2.tsx

import onboarding2 from "../assets/onboarding2.png";

export default function Onboarding2() {
  return (
    <div className="flex flex-1 gap-3 flex-col items-center justify-center">
      <h1 className="font-caveat text-light-green text-8xl font-bold">
        Keep track
      </h1>
      <h2 className="text-white/90 text-4xl pl-10 font-sans font-bold">
        of your reading journey
      </h2>
      <img src={onboarding2} alt="Welcome to BooDi" className="w-5/6 pl-10" />
    </div>
  );
}
