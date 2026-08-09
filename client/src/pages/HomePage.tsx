import { ChevronDown, ChevronsRight, Search } from "lucide-react";
import SearchBar from "../components/SearchBar";
import bgHome from "../assets/bg-home.png";
import pfp from "../assets/dummy-pfp.png";
import ReviewCard from "../components/ReviewCard";
import Navbar from "../components/Navbar";
export default function template() {
  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundImage: `url(${bgHome})`,
        backgroundSize: "100% auto",
        backgroundRepeat: "repeat-y",
        backgroundPosition: "top center",
      }}
    >
      {/* header */}
      <div className="flex justify-between mx-7 pt-15">
        <div>
          <p className="text-3xl font-bold">Hi, firstName!</p>
          <p className="text-gray-600 text-md font-medium mt-0.5">
            Let's read a new book~
          </p>
        </div>
        <div className="flex items-center gap-1">
          <img src={pfp} className="w-10 h-10 rounded-full"></img>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* content */}
      <div className="mx-6">
        <div className="mt-7 flex justify-center">
          <SearchBar />
        </div>
        <div className="mx-0.5">
          {/* currently reading */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Currently Reading</p>
              <button className="flex items-center gap-1 text-md text-gray-500">
                See all
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
            <div>image list</div>
          </div>

          {/* trending book */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Trending Book</p>
              <button className="flex items-center gap-1 text-md text-gray-500">
                See all
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
            <div>image list</div>
          </div>
          {/* trending review */}
          <div className="mt-6 pb-30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-bold">Trending Review</p>
              <button className="flex items-center gap-1 text-md text-gray-500">
                See all
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
            <ReviewCard />
          </div>
        </div>
      </div>
      {/* navbar */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2">
        <Navbar />
      </div>
    </div>
  );
}
