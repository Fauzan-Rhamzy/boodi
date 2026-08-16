import bg from "../assets/bg-author.png";
import avatar from "../assets/avatar.png"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackArrow from "../components/BackArrow";
import type { Author } from "../types/author";
import { getAuthorByID } from "../api/author";

export default function AuthorPage() {
    const { id } = useParams();
    const [ author, setAuthor ] = useState<Author | null>(null);

    useEffect(() => {
          async function fetchAuthorByID() {
            if (!id) return;
            try {
              const book = await getAuthorByID(Number(id));
              setAuthor(book);
            } catch (error) {
              console.error("Failed to get detail book:", error);
            }
          }
          
          fetchAuthorByID();
      }, [id]);

      if (!author) {
        return <p>Loading...</p>;
    }
    
    return (
        <div className="w-full min-h-screen relative"
            style={{
                backgroundImage:`url(${bg})`, 
                backgroundSize: "100% auto",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "top center",
            }}>
            <div className="w-full flex justify-start px-10">
                <BackArrow useHistory={true} backPath="/" />
            </div> 

            <div className="flex flex-col items-center pt-2 pb-10 px-4">
                {/* profile pict dan nama */}
                <img 
                    src={avatar} 
                    alt="Avatar"
                    className="w-[174px] h-[174px] object-cover mt-15"
                />

                <h1
                    className="text-center text-2xl font-bold text-gray-900 mt-3">
                    {author.name}
                </h1>

                <div className="w-full max-w-md mx-auto space-y-6 text-left px-4 mt-2">
                    {/* decription box */}
                    <h2
                        className="font-bold text-xl mb-3 text-gray-900"
                        style={{ marginBottom: '3px', marginTop: '7px' }}>
                        Description
                    </h2>

                    <div className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-100"
                        style={{ padding: '15px 17px' }}>
                        <p className="text-gray-800 text-sm leading-snug text-justify">
                            {author.description}
                        </p>
                    </div>

                    {/* Buku-buku author */}
                    <div>
                        <h2
                            className="font-bold text-xl text-gray-900"
                            style={{ marginBottom: '7px', marginTop: '10px' }}>
                            Books by {author.name}
                        </h2>
                        
                        <div className="grid grid-cols-3 gap-5 mb-5">
                        {author?.books?.map((book) => (
                            <Link 
                            key={book.id} 
                            to={`/bookDetail/${book.id}`} 
                            className="block hover:scale-102 transition-transform duration-150"
                            >
                            <img
                                src={`http://localhost:8080/images/${book.cover}`}
                                alt={book.title}
                                className="w-full aspect-[2/3] object-cover rounded-[18px] shadow-sm cursor-pointer"
                            />
                            </Link>
                        ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}