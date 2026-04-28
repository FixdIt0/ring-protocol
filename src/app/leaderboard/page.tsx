"use client";
import { Marquee } from "@/components/Marquee";

export default function LeaderboardPage() {
  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-5xl mx-auto">
      <Marquee text="★ LEADERBOARD ★ TOP LAUNCHERS ★ TOP BULLS ★ TOP EARNERS ★" />
      <h1 className="pix-display text-xl sm:text-2xl text-center">
        <span className="ring-gradient">LEADERBOARD</span>
      </h1>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="pix-display text-sm ring-gradient mb-4">TOP LAUNCHERS</h2>
          <div className="pix-card text-center py-12">
            <div className="pix-display text-white/30 text-sm">NO DATA YET</div>
            <p className="text-white/20 mt-2 text-sm">Launch tokens to appear here.</p>
          </div>
        </div>
        <div>
          <h2 className="pix-display text-sm ring-gradient mb-4">TOP BULLS</h2>
          <div className="pix-card text-center py-12">
            <div className="pix-display text-white/30 text-sm">NO DATA YET</div>
            <p className="text-white/20 mt-2 text-sm">Bull up on tokens to appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
