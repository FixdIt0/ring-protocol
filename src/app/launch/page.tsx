"use client";
import { useState } from "react";
import { Marquee } from "@/components/Marquee";

export default function LaunchPage() {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [target, setTarget] = useState("");
  const [image, setImage] = useState<File | null>(null);

  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-3xl mx-auto">
      <Marquee text="★ LAUNCH A TOKEN ★ ASSIGN FEES ★ ENTER THE RING ★" />

      <h1 className="pix-display text-xl sm:text-2xl text-center glitch-text">
        LAUNCH <span className="ring-gradient">A TOKEN</span>
      </h1>
      <p className="text-center text-white/50 mt-4">
        Deploy on Printr. Fees route to the RING vault. Split between launcher, target, and backers.
      </p>

      <div className="mt-10 space-y-6">
        {/* Token Name */}
        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">TOKEN NAME</label>
          <input
            className="pix-input"
            placeholder="e.g. Ring Fighter"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Ticker */}
        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">TICKER</label>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xl">$</span>
            <input
              className="pix-input"
              placeholder="RING"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              maxLength={10}
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">IMAGE</label>
          <div className="pix-card flex items-center justify-center h-40 cursor-pointer hover:border-white/30 transition-colors">
            <label className="cursor-pointer text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
              {image ? (
                <span className="text-white">{image.name}</span>
              ) : (
                <span className="text-white/40">Click to upload (PNG/JPG, max 2MB)</span>
              )}
            </label>
          </div>
        </div>

        {/* Target X Handle */}
        <div>
          <label className="pix-display text-[10px] text-white/50 block mb-2">FEE TARGET (X HANDLE)</label>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xl">@</span>
            <input
              className="pix-input"
              placeholder="elonmusk (optional — defaults to you)"
              value={target}
              onChange={(e) => setTarget(e.target.value.replace("@", ""))}
            />
          </div>
          <div className="text-white/30 text-sm mt-1">
            This person receives 30% of all trading fees. Leave blank to assign to yourself.
          </div>
        </div>

        {/* Fee Display */}
        <div className="pix-card">
          <div className="pix-display text-[10px] text-white/40 mb-3">FEE CONFIG (FIXED)</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/50">Fee Type</span>
              <div className="text-white mt-1">Creator</div>
            </div>
            <div>
              <span className="text-white/50">Custom Fee (Post-Grad)</span>
              <div className="ring-gradient font-bold mt-1">1.40%</div>
            </div>
            <div>
              <span className="text-white/50">Protocol Fee</span>
              <div className="text-white mt-1">0.20%</div>
            </div>
            <div>
              <span className="text-white/50">Provider Fee</span>
              <div className="text-white mt-1">0.40%</div>
            </div>
          </div>
          <div className="mt-3 text-white/30 text-sm">
            Total post-graduation: 2.00% — 1.40% custom fee funds the RING vault split.
          </div>
        </div>

        {/* Split Preview */}
        <div className="pix-card pix-card-gold">
          <div className="pix-display text-[10px] text-white/40 mb-3">VAULT SPLIT</div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="pix-display text-lg ring-gradient">40%</div>
              <div className="text-[10px] text-white/50 pix-display mt-1">YOU</div>
            </div>
            <div>
              <div className="pix-display text-lg ring-gradient">30%</div>
              <div className="text-[10px] text-white/50 pix-display mt-1">
                {target ? `@${target}` : "TARGET"}
              </div>
            </div>
            <div>
              <div className="pix-display text-lg ring-gradient">25%</div>
              <div className="text-[10px] text-white/50 pix-display mt-1">BACKERS</div>
            </div>
            <div>
              <div className="pix-display text-lg ring-gradient">5%</div>
              <div className="text-[10px] text-white/50 pix-display mt-1">RING</div>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <button
          className="pix-btn pix-btn-grad w-full text-center"
          disabled={!name || !ticker}
        >
          {name && ticker ? `LAUNCH $${ticker}` : "FILL IN DETAILS TO LAUNCH"}
        </button>
      </div>
    </div>
  );
}
