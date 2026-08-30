import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Add } from "./Icons";
import toast from "react-hot-toast";

type TrackProgressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialBook?: {
    id: number;      
    title: string;
    cover: string;
    current_page?: number;
  } | null;
  onSave?: (data: {
    book_id: number;
    pages_read: number;
    read_date: string;
  }) => void
};

export default function TrackProgressPopUp({ initialBook, isOpen, onClose, onSave }: TrackProgressModalProps) {
  const [selectedBook, setSelectedBook] = useState(initialBook || null);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [pages, setPages] = useState<number | string>(initialBook?.current_page || 1);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
  if (isOpen) {
    if (initialBook) {
      setSelectedBook(initialBook);
      setPages(initialBook.current_page ?? 1);
    } else {
      setSelectedBook(null);
      setPages(1);
    }
  }
}, [isOpen, initialBook, initialBook?.current_page]);

  const handleCancel = () => {
    setSelectedBook(initialBook || null);
    setPages(initialBook?.current_page || 1);
    setDate(new Date().toISOString().split("T")[0]);
    
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if (!selectedBook) {
      toast.error("Choose a book!");
      return;
    }

    const pagesNum = Number(pages);
    if (!pages || isNaN(pagesNum) || pagesNum <= 0) {
      toast.error("Page is not valid!");
      return;
    }

    if (onSave) {
      try {
        await onSave({
          book_id: selectedBook.id,
          pages_read: pagesNum,
          read_date: date,
        });
        onClose();
      } catch (error) {
        
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <form 
        onSubmit={handleSubmit}
        className="relative w-full max-w-md h-[70vh] bg-white rounded-t-[32px] p-4 z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-4" /> 
          <h2 className="text-xl font-bold text-text">Track Progress</h2>
          <button
          type="button"
            onClick={onClose}
            className="p-1 text-text cursor-pointer hover:opacity-70 transition-opacity"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Cover buku */}
        <div className="flex flex-col items-center justify-center mb-4 gap-2">
          {selectedBook ? (
            <>
              {/* Kondisi 1: kalo buka track nya di page detail books -> bukunya sesuai di page detail book itu  */}
              <img
                src={`http://localhost:8080/images/${selectedBook.cover}`}
                alt={selectedBook.title}
                className="w-[111px] h-[176px] object-cover rounded-[16px] shadow-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              />
              <p className="text-s font-bold text-text">{selectedBook.title}</p>
            </>
          ) : (
            <>
              {/* kondisi 2: kalo buka track buku dari page profile diary -> belom tau buku yang ditrack mau yang mana  */}
              <button
                type="button"
                className="bg-light-green/60 hover:bg-light-green text-white p-4 w-[111px] h-[176px] rounded-[16px] shadow-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                <Add className="w-8 h-8 text-dark-green stroke-[3]" />
              </button>
              <p className="text-s font-bold text-text">No book Selected</p>
            </>
          )}
        </div>

        {/* Form Input Tanggal & Halaman */}
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-l font-bold text-text mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                defaultValue={date}
                onClick={(e) => e.currentTarget.showPicker?.()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-light-green text-l text-text  focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-start pt-2 gap-4">
            <label className="text-l font-bold text-text">Pages Read</label>
            <input
              type="number"
              inputMode="numeric"
              autoFocus
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="w-15 text-center py-1.5 rounded-lg border border-light-green text-sm font-semibold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/2 border-2 border-dark-green py-2 rounded-md hover:bg-gray-300 transition-colors font-bold text-dark-green hover:cursor-pointer"
              >
              Cancel
            </button>

            <button
              className="w-full bg-dark-green text-white py-2 rounded-md font-medium hover:cursor-pointer"
              type="submit"
              >
              Save 
            </button>
        </div>

      </form>
    </div>
  );
}