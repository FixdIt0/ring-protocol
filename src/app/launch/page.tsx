"use client";
import { useState } from "react";
import { Marquee } from "@/components/Marquee";

export default function LaunchPage() {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [target, setTarget] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [mode, setMode] = useState<"standard" | "pvp">("standard");
  const [split, setSplit] = useState({ launcher: 40, target: 30, bulls: 25, protocol: 5 });

  const updateSplit = (key: keyof typeof split, val: number) => {
    const next = { ...split, [key]: val };
    const sum = next.launcher + next.target + next.bulls + next.protocol;
    if (sum === 100) setSplit(next);
  };

  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-3xl mx-auto">
      <Marquee text="★ LAUNCH A TOKEN ★ STANDARD OR PVP ★ ENTER THE RING ★" />
      <h1 className="pix-display text-xl sm:text-2xl text-center glitch-text">
        LAUNCH <span className="ring-gradient">A TOKEN</span>
      </h1>

      <div className="mt-10 space-y-6">
        {/* Mode selector */}
        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">LAUNCH MODE</label>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setMode("standard")} className={`pix-card text-center cursor-pointer transition-all ${mode === "standard" ? "pix-card-gold border-yellow-500" : "opacity-50"}`}>
              <div className="pix-display text-sm ring-gradient">🥊 STANDARD</div>
              <div className="text-xs text-white/50 mt-1">Earn fees with your bulls</div>
            </button>
            <button onClick={() => setMode("pvp")} className={`pix-card text-center cursor-pointer transition-all ${mode === "pvp" ? "pix-card-red border-red-500" : "opacity-50"}`}>
              <div className="pix-display text-sm ring-gradient">⚔️ PVP</div>
              <div className="text-xs text-white/50 mt-1">Winner takes all</div>
            </button>
          </div>
        </div>

        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">TOKEN NAME</label>
          <input className="pix-input" placeholder="e.g. Ring Fighter" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">TICKER</label>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xl">$</span>
            <input className="pix-input" placeholder="RING" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} maxLength={10} />
          </div>
        </div>

        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">IMAGE</label>
          <div className="pix-card flex items-center justify-center h-32 cursor-pointer hover:border-white/30">
            <label className="cursor-pointer text-center">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
              {image ? <span className="text-white">{image.name}</span> : <span className="text-white/40">Click to upload</span>}
            </label>
          </div>
        </div>

        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">FEE TARGET (X HANDLE)</label>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xl">@</span>
            <input className="pix-input" placeholder="elonmusk (optional)" value={target} onChange={(e) => setTarget(e.target.value.replace("@", ""))} />
          </div>
        </div>

        {/* Configurable split */}
        <div className="pix-card pix-card-gold">
          <div className="pix-display text-[10px] text-white/40 mb-3">VAULT SPLIT (must total 100%)</div>
          <div className="grid grid-cols-4 gap-4 text-center">
            {(["launcher", "target", "bulls", "protocol"] as const).map((key) => (
              <div key={key}>
                <input
                  type="number" min={0} max={100}
                  className="pix-input text-center text-lg"
                  value={split[key]}
                  onChange={(e) => updateSplit(key, parseInt(e.target.value) || 0)}
                />
                <div className="text-[9px] text-white/50 pix-display mt-1">{key === "bulls" ? "BULLS" : key.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div className={`text-center mt-2 pix-display text-[10px] ${split.launcher + split.target + split.bulls + split.protocol === 100 ? "text-green-400" : "text-red-400"}`}>
            TOTAL: {split.launcher + split.target + split.bulls + split.protocol}%
          </div>
        </div>

        {mode === "pvp" && (
          <div className="pix-card pix-card-red">
            <div className="pix-display text-[10px] ring-gradient">⚔️ PVP MODE</div>
            <p className="text-white/50 text-sm mt-2">Someone can reply to the same tweet with their own PvP launch. Both pots merge. First to graduate wins ALL. Winner pot auto-buys on migration 🚀</p>
          </div>
        )}

        <div className="pix-card">
          <div className="pix-display text-[10px] text-white/40 mb-3">FEE CONFIG (FIXED)</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-white/50">Fee Type</span><div className="text-white mt-1">Creator</div></div>
            <div><span className="text-white/50">Custom Fee (Post-Grad)</span><div className="ring-gradient font-bold mt-1">1.40%</div></div>
          </div>
        </div>

        <button className="pix-btn pix-btn-grad w-full" disabled={!name || !ticker || split.launcher + split.target + split.bulls + split.protocol !== 100}>
          {name && ticker ? `${mode === "pvp" ? "⚔️" : "🥊"} LAUNCH $${ticker}` : "FILL IN DETAILS"}
        </button>
      </div>
    </div>
  );
}
