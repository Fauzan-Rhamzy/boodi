import bg from "../assets/bg-landing.png";
import illust from "../assets/illust.png";
import { ChevronsUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div
      className="w-full h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex h-full flex-col items-center justify-center ">
        <p
          style={{ color: "var(--text-color)" }}
          className="text-7xl font-bold"
        >
          BooDi
        </p>
        <div className="bg-[#2d68ff]  px-12 text-white rounded-4xl mt-2">
          <p className="text-sm tracking-[0.4rem]">Book Diary</p>
        </div>

        <img
          src={illust}
          alt="a guy reading book"
          className="w-80 mt-6 mb-30"
        />
        <p>Swipe up to start</p>
        <ChevronsUp className=" w-10 h-10 " />
      </div>
    </div>
  );
}
