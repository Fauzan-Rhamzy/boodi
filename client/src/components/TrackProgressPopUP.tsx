import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import { Add } from "./Icons";
import toast from "react-hot-toast";
import { useAuth } from "../features/auth/AuthContext";

type TrackProgressModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TrackProgressPopUp({ isOpen, onClose }: TrackProgressModalProps) {
  if (!isOpen) return null;
  const { user, refetch } = useAuth();
  const [date, setDate] = useState<string>("");
  const [pages, setPages] = useState<number | string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (date.trim() === "") {
      toast.error("Date should not be empty!");
      return;
    }

    const pageNum = Number(pages);
    if(!pageNum || pageNum <= 0){
        toast.error("Pages should not be less than 0!")
    }

    const loading = toast.loading("Saving changes...");

    const formData = new FormData();

    if (file) {
      formData.append("pfp", file);
    }

    formData.append("Date", date); 
    formData.append("Pages", pageNum || "");

    try {
      await updateProfile(user?.user_id, formData);
      toast.dismiss(loading);
      refetch();
      toast.success("Profile updated");
      setFile(null);
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md h-[70vh] bg-white rounded-t-[32px] p-4 z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-4" /> 
          <h2 className="text-xl font-bold text-text">Track Progress</h2>
          <button
            onClick={onClose}
            className="p-1 text-text cursor-pointer hover:opacity-70 transition-opacity"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Cover buku */}
        <div className="flex flex-col items-center justify-center mb-4 gap-2">
          <button
            type="button"
            className="bg-light-green/60 hover:bg-light-green text-white p-4 w-[111px] h-[176px] rounded-[16px] shadow-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <Add className="w-8 h-8 text-dark-green stroke-[3]"/>
          </button> 
          <p className="text-s font-bold text-text">No book Selected</p>
        </div>

        {/* Form Input Tanggal & Halaman */}
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-l font-bold text-text mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                onClick={(e) => e.currentTarget.showPicker?.()}
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
              defaultValue="1"
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
            onClick={(e) => handleSaveChanges(e)}
            >
            Save 
            </button>
        </div>

      </div>
    </div>
  );
}