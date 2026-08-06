import bg from "../assets/bg-author.png";
import backBtn from "../assets/back-btn.png";
import avatar from "../assets/avatar.png"
import book1 from "../assets/books-cover/book1.png"
import book2 from "../assets/books-cover/book2.png"
import book3 from "../assets/books-cover/book3.png"
import book4 from "../assets/books-cover/book4.png"
import book5 from "../assets/books-cover/book5.png"
import book6 from "../assets/books-cover/book6.png"
import { useNavigate } from "react-router-dom";

export default function AuthorPage() {
    const navigate = useNavigate();
    
    return (
        <div    
            className="w-full min-h-screen bg-cover bg-top overflow-y-auto"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundRepeat: "no-repeat",
            }}>

            <div className="relative w-full max-w-md min-h-screen px-4 pt-6">

                {/* tombol back */}
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-10 left-5 z-10 w-7 h-7 flex items-center justify-center p-1 rounded-full active:scale-90 transition-all">
                    <img 
                        src={backBtn} 
                        alt="back" 
                        className="w-full h-full object-contain"></img>
                </button>

                {/* profile pict dan nama */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <img 
                        src={avatar} 
                        alt="Avatar"
                        className="w-[174px] h-[174px] object-cover"
                    />

                    <h1
                        className="text-center text-3xl font-bold text-gray-900"
                        style={{ marginTop: '11px'}}>
                        Dolores
                    </h1>
                </div>

                <div className="absolute top-80 left-6 right-6">
                    {/* decription box */}
                    <h2
                        className="font-bold text-xl mb-3 text-gray-900"
                        style={{ marginBottom: '3px' , marginTop: '7px' }}>
                        Description
                    </h2>

                    <div className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-100"
                            style={{ padding: '20px 17px' }}>
                        <p className="text-gray-800 text-sm leading-snug text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam  mattis libero. Donec luctus est pretium nisi volutpat, a commodo velit  scelerisque. Morbi vehicula arcu nec ultricies vestibulum. Donec semper  erat consectetur odio feugiat, ut tinc
                        </p>
                    </div>

                    {/* Buku-buku author */}
                    <div>
                        <h2
                            className="font-bold text-xl text-gray-900"
                            style={{ marginBottom: '7px', marginTop: '15px' }}>
                            Books by Dolores
                        </h2>

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
                            className="w-full aspect-[2/3] object-cover rounded-[18px] shadow-sm" 
    />
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}