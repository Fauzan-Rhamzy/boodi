import { Image, PictureInPicture } from "lucide-react";

export default function BookPhoto({ cover }: { cover?: string }) {
  return (
    <div className="bg-white w-40 h-60 rounded-xl flex items-center justify-center">
      {cover ? (
        <img src={cover} className="w-60 h-60 rounded-xl object-cover" />
      ) : (
        <Image className="text-gray-500 w-20 h-20" />
      )}
    </div>
  );
}
