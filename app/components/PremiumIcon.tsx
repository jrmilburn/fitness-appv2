import { useState } from "react";

export default function PremiumIcon({ text }: { text: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute right-0 top-0 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div className="z-40 flex items-center justify-center w-4 h-4 bg-yellow-500 rounded-full text-white cursor-pointer">
        <span className="text-xs font-bold">★</span>
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div className="z-50 absolute top-full mt-2 w-max px-2 py-1 bg-black text-white text-sm rounded shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}