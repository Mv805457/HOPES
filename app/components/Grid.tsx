"use client";

import { useState, useEffect } from "react";

export default function WaveGrid({ items, onClick }: any) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: any) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
  <div
  className="grid gap-[4px] w-full h-full"
  style={{
    gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
    justifyContent: "center",
    alignContent: "center",
  }}
>

    {items.map((item: any) => {
      return (
        <WaveCell
          key={item.id}
          item={item}
          mouse={mouse}
          onClick={() => onClick(item)}
        />
      );
    })}
  </div>
);

}

function WaveCell({ item, mouse, onClick }: any) {
  const [hover, setHover] = useState(false);

  // cell size
  const size = 40;

  const rect = typeof window !== "undefined"
    ? document.body.getBoundingClientRect()
    : { left: 0, top: 0 };

  const dx = (mouse.x - rect.left) - item.gridX * size;
  const dy = (mouse.y - rect.top) - item.gridY * size;

  const dist = Math.sqrt(dx * dx + dy * dy);
  const wave = Math.max(0, 200 - dist);

  const scale = hover ? 4 : 1 + wave / 6000;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className="relative rounded overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `scale(${scale})`,
        zIndex: hover ? 10 : scale > 1.2 ? 5 : 1,
      }}
    >
      <img
        src={item.thumbnail}
        className="w-full h-full object-cover"
        alt=""
      />

      {hover && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 text-[8px]">
          <div className="font-bold">{item.title}</div>
          <div className="opacity-70">
            {item.type === "podcast"
              ? `${item.author} • ${item.duration}`
              : `${item.author} • ${item.readTime}`}
          </div>
        </div>
      )}
    </div>
  );
}
