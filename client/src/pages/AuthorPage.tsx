import bg from "../assets/bg-author.png";
import avatar from "../assets/avatar.png"
import book1 from "../assets/books-cover/book1.png"
import book2 from "../assets/books-cover/book2.png"
import book3 from "../assets/books-cover/book3.png"
import book4 from "../assets/books-cover/book4.png"
import book5 from "../assets/books-cover/book5.png"
import book6 from "../assets/books-cover/book6.png"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackArrow from "../components/BackArrow";

interface Author {
  id: number;
  name: string;
  description: string;
  profilePict: string;
  books: string[];
}

export default function AuthorPage() {
    const { id } = useParams(); 
    const [author, setAuthor] = useState<Author | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/author/${id}`) 
        .then((res) => res.json())
        .then((data) => setAuthor(data.data))
        .catch((err) => console.error("fetch failed:", err));
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
                <BackArrow />
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
                        style={{ marginBottom: '3px' , marginTop: '7px' }}>
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

                        {/* <div className="grid grid-cols-3 gap-5">
                            {author.books.map(() => (

                            ))}
                        </div> */}

                        {/* masih kek gini soalnya belom bisa masukin gambar ke db  */}
                        <div className="grid grid-cols-3 gap-5"
                        style={{ marginBottom: '20px' }}>
                            <img 
                            src={book1} 
                            alt="Book 1" 
                            className="w-full aspect-[2/3] object-cover rounded-[18px] shadow-sm" 
                            />
                            <img 
                            src={book2} 
                            alt="Book 2" 
                            className="w-full aspect-[2/3] object-cover rounded-[18px] shadow-sm" 
                            />
                            <img 
                            src={book3} 
                            alt="Book 3" 
                            className="w-full aspect-[2/3] object-cover rounded-[18px] shadow-sm" 
                            />
                            <img 
                            src={book4} 
                            alt="Book 4" 
                            className="w-full aspect-[2/3] object-cover rounded-[18px] shadow-sm" 
                            />
                            <img 
                            src={book5} 
                            alt="Book 5" 
                            className="w-full aspect-[2/3] object-cover rounded-[18px] shadow-sm" 
                            />
                            <img 
                            src={book6} 
                            alt="Book 6" 
                            className="w-full aspect-[2/3] object-cover rounded-[18px] shadow-sm"/>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}