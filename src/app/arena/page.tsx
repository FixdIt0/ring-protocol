"use client";
import { useEffect, useState } from "react";
import { Marquee } from "@/components/Marquee";

interface Match { id: string; tokenAId: string; tokenBId: string; combinedPot: number; winnerId: string | null; status: string; }

export default function ArenaPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches").then(r => r.json()).then(setMatches).finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-5xl mx-auto">
      <Marquee text="★ PVP ARENA ★ WINNER TAKES ALL ★ LOSERS GET NOTHING ★" />
      <h1 className="pix-display text-xl sm:text-2xl text-center glitch-text">
        ⚔ <span className="ring-gradient">THE ARENA</span>
      </h1>
      <p className="text-center text-white/50 mt-4">Live PvP ring matches. Two tokens enter. One wins the pot.</p>

      <div className="mt-10 space-y-6">
        {loading && <div className="text-center text-white/30 pix-display text-sm py-16">LOADING...</div>}

        {!loading && matches.length === 0 && (
          <div className="pix-card text-center py-16">
            <div className="pix-display text-white/30">NO ACTIVE MATCHES</div>
            <p className="text-white/20 mt-2">Launch two PvP tokens from the same tweet thread to start a Ring Match.</p>
          </div>
        )}

        {matches.map((m) => (
          <div key={m.id} className="pix-card pix-card-red">
            <div className="flex items-center justify-between mb-4">
              <span className="badge-match">RING MATCH</span>
              <span className={m.status === "live" ? "badge-live" : "badge-ended"}>
                {m.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center text-center">
              <div>
                <div className="pix-display text-sm ring-gradient">{m.tokenAId.slice(0, 8)}</div>
              </div>
              <div>
                <div className="pix-display text-2xl text-white/20">VS</div>
                <div className="mt-2 pix-display text-xs text-white/40">POT</div>
                <div className="pix-display text-lg ring-gradient">{m.combinedPot.toFixed(2)} SOL</div>
              </div>
              <div>
                <div className="pix-display text-sm ring-gradient">{m.tokenBId.slice(0, 8)}</div>
              </div>
            </div>
            {m.winnerId && (
              <div className="mt-4 text-center pix-display text-xs ring-gradient">
                🏆 WINNER: {m.winnerId.slice(0, 8)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
