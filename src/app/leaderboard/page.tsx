import { Marquee } from "@/components/Marquee";

const MOCK_LAUNCHERS = [
  { rank: 1, handle: "@trader1", launches: 12, earned: "34.2 SOL", wins: 5 },
  { rank: 2, handle: "@catfan", launches: 8, earned: "28.7 SOL", wins: 4 },
  { rank: 3, handle: "@dogdev", launches: 15, earned: "22.1 SOL", wins: 3 },
];

const MOCK_BACKERS = [
  { rank: 1, handle: "@whale99", backed: 42, earned: "18.4 SOL", followers: "124K" },
  { rank: 2, handle: "@alpha_ct", backed: 31, earned: "14.2 SOL", followers: "89K" },
  { rank: 3, handle: "@degen_sol", backed: 67, earned: "11.8 SOL", followers: "45K" },
];

export default function LeaderboardPage() {
  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-5xl mx-auto">
      <Marquee text="★ LEADERBOARD ★ TOP LAUNCHERS ★ TOP BACKERS ★ TOP EARNERS ★" />

      <h1 className="pix-display text-xl sm:text-2xl text-center">
        <span className="ring-gradient">LEADERBOARD</span>
      </h1>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Launchers */}
        <div>
          <h2 className="pix-display text-sm ring-gradient mb-4">TOP LAUNCHERS</h2>
          <div className="space-y-3">
            {MOCK_LAUNCHERS.map((l) => (
              <div key={l.rank} className="pix-card flex items-center gap-4">
                <div className="pix-display text-2xl text-white/20 w-8">#{l.rank}</div>
                <div className="flex-1">
                  <div className="text-white">{l.handle}</div>
                  <div className="text-xs text-white/40">{l.launches} launches · {l.wins} wins</div>
                </div>
                <div className="pix-display text-sm ring-gradient">{l.earned}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Backers */}
        <div>
          <h2 className="pix-display text-sm ring-gradient mb-4">TOP BACKERS</h2>
          <div className="space-y-3">
            {MOCK_BACKERS.map((b) => (
              <div key={b.rank} className="pix-card flex items-center gap-4">
                <div className="pix-display text-2xl text-white/20 w-8">#{b.rank}</div>
                <div className="flex-1">
                  <div className="text-white">{b.handle}</div>
                  <div className="text-xs text-white/40">{b.backed} backed · {b.followers} followers</div>
                </div>
                <div className="pix-display text-sm ring-gradient">{b.earned}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
