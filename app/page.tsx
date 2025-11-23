"use client";

import InfiniteWaveGrid from "./components/InfiniteGrid";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-black overflow-x-hidden relative">
      <div className="fixed top-10 left-1/2 -translate-x-1/2 text-white/10 text-5xl tracking-tight font-bold z-0 pointer-events-none select-none">
        MEDIA BUBBLES
      </div>
      <InfiniteWaveGrid />
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-20" />
    </div>
  );
}
