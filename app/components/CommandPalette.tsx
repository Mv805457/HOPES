"use client";

import { useEffect, useState } from "react";

interface CommandPaletteProps {
  settings: {
    waveStrength: number;
    autoScroll: boolean;
    gridSize: number;
    darkMode: boolean;
  };
  setSettings: React.Dispatch<
    React.SetStateAction<{
      waveStrength: number;
      autoScroll: boolean;
      gridSize: number;
      darkMode: boolean;
    }>
  >;
  onShuffle: () => void;
}

export default function CommandPalette({
  settings,
  setSettings,
  onShuffle,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-white font-medium">Command Palette</h2>
        </div>
        <div className="p-2 space-y-1">
          <Item
            label="Toggle Auto-Scroll"
            active={settings.autoScroll}
            onClick={() =>
              setSettings((s) => ({ ...s, autoScroll: !s.autoScroll }))
            }
          />
          <Item
            label="Toggle Wave Effect"
            active={settings.waveStrength > 0}
            onClick={() =>
              setSettings((s) => ({
                ...s,
                waveStrength: s.waveStrength > 0 ? 0 : 1,
              }))
            }
          />
          <Item
            label="Shuffle Grid"
            onClick={() => {
              onShuffle();
              setOpen(false);
            }}
          />
          <Item
            label={`Grid Size: ${settings.gridSize}px`}
            onClick={() =>
              setSettings((s) => ({
                ...s,
                gridSize: s.gridSize === 32 ? 40 : 32,
              }))
            }
          />
        </div>
        <div className="p-2 bg-white/5 text-[10px] text-white/40 text-center">
          Press ESC to close
        </div>
      </div>
      <div
        className="absolute inset-0 -z-10"
        onClick={() => setOpen(false)}
      />
    </div>
  );
}

function Item({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-md transition-colors text-left"
    >
      <span>{label}</span>
      {active !== undefined && (
        <span
          className={`w-2 h-2 rounded-full ${
            active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-gray-700"
          }`}
        />
      )}
    </button>
  );
}
