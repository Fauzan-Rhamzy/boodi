import { Image } from "lucide-react";

export default function BookPhoto({
  preview,
  originalCover,
}: {
  preview?: string;
  originalCover?: string;
}) {
  return (
    <div className="bg-white w-40 h-60 rounded-xl flex items-center justify-center">
      {preview || originalCover ? (
        <img
          src={
            preview ? preview : `http://localhost:8080/images/${originalCover}`
          }
          className="relative aspect-[2/3] rounded-xl object-cover"
        />
      ) : (
        <Image className="text-gray-500 w-20 h-20" />
      )}
    </div>
  );
}
