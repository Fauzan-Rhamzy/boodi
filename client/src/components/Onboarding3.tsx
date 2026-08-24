// Onboarding1.tsx

import onboarding3 from "../assets/onboarding3.png";

export default function Onboarding3() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <img src={onboarding3} alt="Welcome to BooDi" className="w-2/3" />

      <h1 className="font-bold font-sans text-white text-5xl">
        Write a{" "}
        <span className="text-light-green font-caveat text-7xl">review</span>,
      </h1>
      <h1 className="font-bold text-white text-5xl">
        <span className="text-light-green font-caveat text-7xl">inspire </span>{" "}
        others
      </h1>
    </div>
  );
}
