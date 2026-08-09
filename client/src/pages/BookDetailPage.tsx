import BackArrow from "../components/BackArrow";
import bgDetailBook from "../assets/bg-detailBooks.png";
import { Plus, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import book1 from "../assets/booksCover/mindOverMatter.png"

interface Book {
  id: number;
  title: string;
  price: number;
  year: number;
  page: number;
  language: string;
  description: string;
  cover: string;
  genres: string[];
  authors: string[];
}

export default function BookDetailPage() {
    const { id } = useParams(); 
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/books/${id}`) 
        .then((res) => res.json())
        .then((data) => setBook(data.data))
        .catch((err) => console.error("gagal fetch:", err));
    }, [id]);

    if (!book) {
        return <p>Loading...</p>;
    }

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
                {book.title}
            </h1>

            <div className="flex items-center gap-1 text-gray-700 mb-2">
                <span className="text-gray-900">{book.year}</span>
                <span>•</span>
                <span className="whitespace-nowrap">Written by</span>
                <span className="font-bold underline cursor-pointer text-gray-900 underline-offset-3">
                    {book.authors}
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
                    <p className="text-base font-bold text-black mt-0.5">${book.price.toLocaleString("id-ID")}</p>
                </div>

                <div className="h-8 w-[1px] bg-black"></div>

                <div className="px-6">
                    <p className="text-sm text-gray-700 font-medium">Pages</p>
                    <p className="text-base font-bold text-black mt-0.5">{book.page}</p>
                </div>

                <div className="h-8 w-[1px] bg-black"></div>

                <div className="px-6">
                    <p className="text-sm text-gray-700 font-medium">Language</p>
                    <p className="text-base font-bold text-black mt-0.5">{book.language}</p>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-4">
                <h2
                    className="font-bold text-xl mb-3 text-gray-900"
                    style={{ marginBottom: '3px' , marginTop: '7px' }}>
                    Genres
                </h2>

                <div className="flex flex-wrap gap-1.5">
                    {book.genres.map((genre) => (
                        <span
                            key={genre}
                            className="px-2 py-1 bg-[#8fa4bf] text-white text-xs rounded-full"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
                <h2
                    className="font-bold text-xl mb-3 text-gray-900"
                    style={{ marginBottom: '3px' , marginTop: '7px' }}>
                    Description
                </h2>

                <div className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-100"
                        style={{ padding: '15px 17px' }}>
                    <p className="text-gray-800 text-sm leading-snug text-justify">
                        {book.description}
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