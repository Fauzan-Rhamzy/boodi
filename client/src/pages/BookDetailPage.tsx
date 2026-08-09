import BackArrow from "../components/BackArrow";
import bgDetailBook from "../assets/bg-detailBooks.png";
import book1 from "../assets/booksCover/book1.png";
import { Plus, Heart } from "lucide-react";

export default function BookDetailPage() {
  return (
    <div className="w-full min-h-screen relative"
        style={{
            backgroundImage:`url(${bgDetailBook})`, 
            backgroundSize: "100% auto",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top center",
        }}>
        <BackArrow/>

        <div className="flex flex-col items-center pt-12 pb-10 px-4">
            <img src={book1} alt="ex1" className="w-45 h-auto object-cover rounded-3xl mt-15"/>
            
            <h1 className="text-center text-3xl font-bold text-gray-900 mb-2"
                style={{marginTop: '5px'}}>
                Lorem Ipsum
            </h1>

            <div className="flex items-center gap-1 text-gray-700 mb-2">
                <span className="text-gray-900">2020</span>
                <span>•</span>
                <span className="whitespace-nowrap">Written by</span>
                <span className="font-bold underline cursor-pointer text-gray-900 underline-offset-3">
                    Dolores
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button className="text-xs flex items-center gap-1 bg-neutral-800 hover:bg-neutral-900 text-white font-medium px-3 py-1 rounded-lg text-sm transition">
                    <Plus className="w-4 h-4"/>
                    <span>Track Progress</span>
                </button>

                <button className="w-6 h-6 p-0 shrink-0 flex items-center justify-center rounded-full border border-black text-black hover:bg-black/5">
                    <Plus className="w-4 h-4" />
                </button>

                <button className="w-6 h-6 p-0 shrink-0 flex items-center justify-center rounded-full border border-black text-black hover:bg-black/5">
                    <Heart className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center text-center mt-4">
                <div className="px-6">
                    <p className="text-sm text-gray-700 font-medium">Price</p>
                    <p className="text-base font-bold text-black mt-0.5">Rp. 80.000</p>
                </div>

                <div className="h-8 w-[1px] bg-black"></div>

                <div className="px-6">
                    <p className="text-sm text-gray-700 font-medium">Pages</p>
                    <p className="text-base font-bold text-black mt-0.5">200</p>
                </div>

                <div className="h-8 w-[1px] bg-black"></div>

                <div className="px-6">
                    <p className="text-sm text-gray-700 font-medium">Language</p>
                    <p className="text-base font-bold text-black mt-0.5">ENG</p>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-4">
                <h2
                    className="font-bold text-xl mb-3 text-gray-900"
                    style={{ marginBottom: '3px' , marginTop: '7px' }}>
                    Genre
                </h2>

                <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-[#8fa4bf] text-white text-xs rounded-full">
                    Horror
                    </span>

                    <span className="px-2 py-1 bg-[#8fa4bf] text-white text-xs rounded-full">
                        Dark Romance
                    </span>

                    <span className="px-2 py-1 bg-[#8fa4bf] text-white text-xs rounded-full">
                        Teen
                    </span>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
                <h2
                    className="font-bold text-xl mb-3 text-gray-900"
                    style={{ marginBottom: '3px' , marginTop: '7px' }}>
                    Description
                </h2>

                <div className="w-full p-6 bg-white rounded-3xl shadow-md border border-gray-100"
                        style={{ padding: '15px 17px' }}>
                    <p className="text-gray-800 text-sm leading-snug text-justify">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam  mattis libero. Donec luctus est pretium nisi volutpat, a commodo velit  scelerisque. Morbi vehicula arcu nec ultricies vestibulum.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
                <h2
                    className="font-bold text-xl mb-3 text-gray-900"
                    style={{ marginBottom: '3px' , marginTop: '7px' }}>
                    Ratings
                </h2>
            </div>

            <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
                <h2
                    className="font-bold text-xl mb-3 text-gray-900"
                    style={{ marginBottom: '3px' , marginTop: '7px' }}>
                    Reviews
                </h2>
            </div>

        </div>
    </div>
  );
}