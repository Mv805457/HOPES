"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CommandPalette from "./CommandPalette";

export default function InfiniteWaveGrid() {
  const [items, setItems] = useState<any[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [settings, setSettings] = useState({
    waveStrength: 1,
    autoScroll: false,
    gridSize: 32,
    darkMode: true,
  });
  const [shockwave, setShockwave] = useState<{ x: number; y: number; time: number } | null>(null);

  const loadingRef = useRef(false);
  const timeRef = useRef(0);
  const requestRef = useRef<number>(0);

  // Generate N new cells
  const generateCells = useCallback((count = 500) => {
    setItems(prev => {
      const start = prev.length;
      const newCells = Array.from({ length: count }).map((_, i) => ({
        id: start + i,
        thumbnail: `https://picsum.photos/seed/${start + i}/200`,
        title: `#${start + i}`,
        author: "InfiniteFeed",
        duration: `${Math.floor(Math.random() * 30) + 5} min`,
      }));
      return [...prev, ...newCells];
    });
  }, []);

  // Load initial cells
  useEffect(() => {
    generateCells(600);
  }, [generateCells]);

  // Infinite scroll loader
  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current) return;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        loadingRef.current = true;
        generateCells(400);
        setTimeout(() => (loadingRef.current = false), 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [generateCells]);

  // Animation Loop (Idle Wave + Auto Scroll)
  useEffect(() => {
    const animate = (time: number) => {
      timeRef.current = time;

      // Auto-scroll logic
      if (settings.autoScroll) {
        window.scrollBy(0, 0.15); // Slow scroll
      }

      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [settings.autoScroll]);

  // Track mouse
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Handle Click for Shockwave
  const handleClick = (e: React.MouseEvent) => {
    setShockwave({ x: e.clientX, y: e.clientY, time: Date.now() });
  };

  return (
    <>
      <CommandPalette
        settings={settings}
        setSettings={setSettings}
        onShuffle={() => {
          setItems([]);
          generateCells(600);
          window.scrollTo(0, 0);
        }}
      />

      <div
        onClick={handleClick}
        className="grid gap-[4px] w-full min-h-screen p-4 z-10 relative"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${settings.gridSize}px, 1fr))`,
        }}
      >
        {items.map((item) => (
          <WaveTile
            key={item.id}
            item={item}
            mouse={mouse}
            settings={settings}
            shockwave={shockwave}
          />
        ))}
      </div>
    </>
  );
}

function WaveTile({ item, mouse, settings, shockwave }: any) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Use a ref for random phase to avoid re-renders
  const phase = useRef(Math.random() * Math.PI * 2);

  // Animation frame for individual tile updates (optimization: could be central, but this is simpler for now)
  useEffect(() => {
    let frameId: number;
    const update = () => {
      if (!tileRef.current) return;

      // Idle Wave
      const time = Date.now() / 1000;
      let x = 0;
      let y = 0;

      if (settings.waveStrength > 0) {
        x = Math.sin(time + phase.current) * 2 * settings.waveStrength;
        y = Math.cos(time + phase.current * 0.8) * 2 * settings.waveStrength;
      }

      setOffset({ x, y });
      frameId = requestAnimationFrame(update);
    };

    // Only animate if wave is enabled or shockwave is active (optimization)
    if (settings.waveStrength > 0 || shockwave) {
      frameId = requestAnimationFrame(update);
    }

    return () => cancelAnimationFrame(frameId);
  }, [settings.waveStrength, shockwave]);

  // Calculate scale/transform
  let scale = 1;
  let zIndex = 1;

  if (typeof window !== "undefined" && tileRef.current) {
    const rect = tileRef.current.getBoundingClientRect();
    const centerX = rect.left + settings.gridSize / 2;
    const centerY = rect.top + settings.gridSize / 2;

    // Mouse Wave
    const dx = mouse.x - centerX;
    const dy = mouse.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const wave = Math.max(0, 200 - dist); // 200px radius

    scale = 1 + wave / 800; // Subtle mouse wave

    // Shockwave
    if (shockwave) {
      const timeSinceClick = Date.now() - shockwave.time;
      const waveSpeed = 0.5; // px per ms
      const waveRadius = timeSinceClick * waveSpeed;
      const waveWidth = 50;

      const distToClick = Math.sqrt(
        Math.pow(centerX - shockwave.x, 2) +
        Math.pow(centerY - shockwave.y, 2)
      );

      if (Math.abs(distToClick - waveRadius) < waveWidth && timeSinceClick < 1000) {
        const intensity = 1 - Math.abs(distToClick - waveRadius) / waveWidth;
        scale += intensity * 0.5; // Pop effect
      }
    }

    if (hover) {
      scale = 3.5;
      zIndex = 50;
    } else if (scale > 1.05) {
      zIndex = 10;
    }
  }

  return (
    <div
      ref={tileRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`
        relative rounded-md overflow-hidden transition-transform duration-150 ease-out
        ${hover ? "shadow-[0_0_12px_rgba(255,255,255,0.3)]" : ""}
      `}
      style={{
        width: settings.gridSize,
        height: settings.gridSize,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        zIndex: zIndex,
      }}
    >
      <img
        src={item.thumbnail}
        className="w-full h-full object-cover pointer-events-none"
        loading="lazy"
        alt=""
      />

      {hover && (
        <div className="absolute inset-0 backdrop-blur-md bg-black/50 flex flex-col justify-end p-1 animate-in fade-in duration-200">
          <div className="text-[6px] font-bold text-white leading-tight">{item.title}</div>
          <div className="text-[5px] text-white/70">{item.duration}</div>
        </div>
      )}
    </div>
  );
}
