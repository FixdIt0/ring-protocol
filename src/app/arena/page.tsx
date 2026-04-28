import { Marquee } from "@/components/Marquee";

const MOCK_MATCHES = [
  { id: 1, tokenA: { ticker: "BULL", vol: "142.5 SOL", mc: "$45K", backers: 12 }, tokenB: { ticker: "BEAR", vol: "98.2 SOL", mc: "$32K", backers: 8 }, pot: "3.37 SOL", status: "live", endsIn: "23:41:12" },
  { id: 2, tokenA: { ticker: "CATS", vol: "312.0 SOL", mc: "$89K", backers: 24 }, tokenB: { ticker: "DOGS", vol: "287.4 SOL", mc: "$76K", backers: 19 }, pot: "8.39 SOL", status: "live", endsIn: "18:05:33" },
];

export default function ArenaPage() {
  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-5xl mx-auto">
      <Marquee text="★ PVP ARENA ★ WINNER TAKES ALL ★ LOSERS GET NOTHING ★" />

      <h1 className="pix-display text-xl sm:text-2xl text-center glitch-text">
        ⚔ <span className="ring-gradient">THE ARENA</span>
      </h1>
      <p className="text-center text-white/50 mt-4">
        Live PvP ring matches. Two tokens enter. One wins the pot. Losers get nothing.
      </p>

      <div className="mt-10 space-y-6">
        {MOCK_MATCHES.map((m) => (
          <div key={m.id} className="pix-card pix-card-red">
            <div className="flex items-center justify-between mb-4">
              <span className="badge-match">RING MATCH #{m.id}</span>
              <span className="badge-live">LIVE</span>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Token A */}
              <div className="text-center">
                <div className="pix-display text-lg ring-gradient">${m.tokenA.ticker}</div>
                <div className="text-sm text-white/60 mt-2">Vol: {m.tokenA.vol}</div>
                <div className="text-sm text-white/60">MC: {m.tokenA.mc}</div>
                <div className="text-sm text-white/40">{m.tokenA.backers} backers</div>
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="pix-display text-2xl text-white/20">VS</div>
                <div className="mt-2 pix-display text-xs text-white/40">POT</div>
                <div className="pix-display text-lg ring-gradient">{m.pot}</div>
                <div className="mt-2 text-[10px] text-white/30 pix-display">{m.endsIn}</div>
              </div>

              {/* Token B */}
              <div className="text-center">
                <div className="pix-display text-lg ring-gradient">${m.tokenB.ticker}</div>
                <div className="text-sm text-white/60 mt-2">Vol: {m.tokenB.vol}</div>
                <div className="text-sm text-white/60">MC: {m.tokenB.mc}</div>
                <div className="text-sm text-white/40">{m.tokenB.backers} backers</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-3 bg-white/5 flex overflow-hidden">
              <div className="bg-gradient-to-r from-ring-cyan to-ring-pink h-full transition-all" style={{ width: "59%" }} />
              <div className="bg-gradient-to-r from-ring-orange to-ring-gold h-full transition-all" style={{ width: "41%" }} />
            </div>
            <div className="flex justify-between text-[10px] pix-display text-white/40 mt-1">
              <span>${m.tokenA.ticker} 59%</span>
              <span>${m.tokenB.ticker} 41%</span>
            </div>
          </div>
        ))}

        {MOCK_MATCHES.length === 0 && (
          <div className="pix-card text-center py-16">
            <div className="pix-display text-white/30">NO ACTIVE MATCHES</div>
            <p className="text-white/20 mt-2">Launch two tokens from the same tweet thread to start a Ring Match.</p>
          </div>
        )}
      </div>
    </div>
  );
}
