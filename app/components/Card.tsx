"use client";
import Image from "next/image";
import { useState } from "react";

export default function Card({ item, onClick }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(item)}
      className={`
        relative cursor-pointer border border-[#333] rounded-lg overflow-hidden
        transition-all duration-300
        ${hovered ? "z-50 scale-[4] shadow-2xl" : "scale-100"}
      `}
      style={{
        width: hovered ? 200 : 40,
        height: hovered ? 200 : 40,
      }}
    >
      <img
  src={item.thumbnail}
  alt={item.title}
  className="w-full h-full object-cover"
/>


      {hovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
          <h3 className="text-xs font-bold">{item.title}</h3>
          <p className="text-[10px] text-gray-300">
            {item.type === "podcast"
              ? `${item.author} • ${item.duration}`
              : `${item.author} • ${item.readTime}`}
          </p>
        </div>
      )}
    </div>
  );
}
