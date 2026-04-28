import Link from "next/link";
import { RingLogo } from "@/components/RingLogo";
import { Marquee } from "@/components/Marquee";
import { StatCard } from "@/components/StatCard";

export default function Home() {
  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-5xl mx-auto">
      <Marquee text="★ ENTER THE RING ★ LAUNCH TOKENS ★ PVP MATCHES ★ WINNER TAKES ALL ★ POWERED BY PRINTR ★ SOLANA ONLY ★" />

      {/* Hero */}
      <section className="text-center pt-6">
        <div className="flex justify-center mb-8">
          <RingLogo size={200} />
        </div>
        <h1 className="pix-display text-2xl sm:text-4xl leading-tight glitch-text">
          LAUNCH TOKENS.<br />
          <span className="ring-gradient">FIGHT FOR FEES.</span>
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto">
          Launch a token on Printr from any tweet. Compete in PvP ring matches.
          Winner takes all the fees. Losers get nothing.<span className="pix-blink" />
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-5 items-center justify-center">
          <Link href="/launch" className="pix-btn pix-btn-grad">▶ ENTER THE RING</Link>
          <Link href="/arena" className="pix-btn pix-btn-red">⚔ LIVE MATCHES</Link>
          <Link href="/tokens" className="pix-btn">BROWSE TOKENS</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <StatCard label="TOTAL IN VAULTS" value="0.00" suffix="SOL" variant="gold" />
        <StatCard label="TOKENS LAUNCHED" value="000" />
        <StatCard label="RING MATCHES" value="000" variant="pink" />
        <StatCard label="FEES CLAIMED" value="0.00" suffix="SOL" variant="orange" />
      </section>

      {/* How it works */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <h2 className="pix-display text-lg sm:text-xl">HOW IT WORKS</h2>
          <div className="ring-gradient-bar mt-3 mx-auto w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="pix-card">
            <div className="pix-display text-[10px] text-white/40">01</div>
            <div className="pix-display text-base mt-2 ring-gradient">LAUNCH</div>
            <p className="mt-3 text-white/70">
              Reply to any tweet with <code className="text-white">@RingProtocol launch $TICKER Name</code>.
              Token deploys on Printr in ~30 seconds. Fees route to the RING vault.
            </p>
          </div>
          <div className="pix-card pix-card-pink">
            <div className="pix-display text-[10px] text-white/40">02</div>
            <div className="pix-display text-base mt-2 ring-gradient">BACK</div>
            <p className="mt-3 text-white/70">
              Anyone replies <code className="text-white">@RingProtocol back</code> to stake their reputation.
              Bigger X account + earlier backing = bigger fee share.
            </p>
          </div>
          <div className="pix-card pix-card-orange">
            <div className="pix-display text-[10px] text-white/40">03</div>
            <div className="pix-display text-base mt-2 ring-gradient">CLAIM</div>
            <p className="mt-3 text-white/70">
              Fees accumulate from trading. Launcher, target, and backers claim their
              split on <span className="ring-gradient">ring.xyz</span> via X login.
            </p>
          </div>
        </div>
      </section>

      {/* Fee Split */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <h2 className="pix-display text-lg sm:text-xl">THE SPLIT</h2>
          <div className="ring-gradient-bar mt-3 mx-auto w-32" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="pix-card pix-card-gold text-center">
            <div className="pix-display text-3xl ring-gradient">40%</div>
            <div className="pix-display text-[9px] text-white/50 mt-2">LAUNCHER</div>
          </div>
          <div className="pix-card pix-card-pink text-center">
            <div className="pix-display text-3xl ring-gradient">30%</div>
            <div className="pix-display text-[9px] text-white/50 mt-2">TARGET</div>
          </div>
          <div className="pix-card text-center">
            <div className="pix-display text-3xl ring-gradient">25%</div>
            <div className="pix-display text-[9px] text-white/50 mt-2">BACKERS</div>
          </div>
          <div className="pix-card pix-card-orange text-center">
            <div className="pix-display text-3xl ring-gradient">5%</div>
            <div className="pix-display text-[9px] text-white/50 mt-2">PROTOCOL</div>
          </div>
        </div>
        <div className="mt-6 pix-card">
          <div className="pix-display text-[10px] text-white/40 mb-3">FEE STRUCTURE (PRINTR V2)</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><span className="text-white/50">Bonding Curve</span><br /><span className="text-white">1.00%</span></div>
            <div><span className="text-white/50">Protocol (Post-Grad)</span><br /><span className="text-white">0.20%</span></div>
            <div><span className="text-white/50">Provider (Post-Grad)</span><br /><span className="text-white">0.40%</span></div>
            <div><span className="text-white/50">Custom (Post-Grad)</span><br /><span className="ring-gradient font-bold">1.40%</span></div>
          </div>
          <div className="mt-3 text-white/40 text-sm">
            Total post-graduation fee: 2.00% — the 1.40% custom fee funds the RING vault.
          </div>
        </div>
      </section>

      {/* PvP Ring Match */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <h2 className="pix-display text-lg sm:text-xl">⚔ PVP RING MATCH</h2>
          <div className="ring-gradient-bar mt-3 mx-auto w-32" />
        </div>
        <div className="pix-card pix-card-red">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="pix-display text-base ring-gradient">TWO TOKENS</div>
              <p className="mt-2 text-white/70">Two people launch competing tokens from the same tweet thread.</p>
            </div>
            <div>
              <div className="pix-display text-base ring-gradient">ONE POT</div>
              <p className="mt-2 text-white/70">Both tokens&apos; fees merge into a shared pot. Volume from both sides.</p>
            </div>
            <div>
              <div className="pix-display text-base ring-gradient">WINNER TAKES ALL</div>
              <p className="mt-2 text-white/70">First to graduate wins 100% of the combined pot. Losers get nothing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Launch from X */}
      <section className="mt-20">
        <div className="text-center mb-10">
          <h2 className="pix-display text-lg sm:text-xl">LAUNCH FROM X</h2>
          <div className="ring-gradient-bar mt-3 mx-auto w-32" />
          <p className="mt-4 text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            Reply to ANY post on X with a launch command tagging{" "}
            <a href="https://x.com/RingProtocol" target="_blank" rel="noreferrer" className="pix-link ring-gradient">
              @RingProtocol
            </a>
            . Token launches in ~30 seconds.
          </p>
        </div>
        <div className="pix-card pix-card-pink">
          <div className="pix-display text-xs ring-gradient mb-3">SYNTAX</div>
          <pre className="text-sm sm:text-base text-white/90 font-mono whitespace-pre-wrap leading-relaxed">
{`@RingProtocol launch $TICKER Token Name
to: @recipient        (optional — defaults to tweet author)
fee: 0.4              (optional, bonding curve fee 0–1.2%)
ammfee: 0.2           (optional, post-graduation fee 0–1.4%)
liq: 80               (optional, liquidity ratio 60–85%)
img: <url>            (optional — uses parent tweet's image)`}
          </pre>
          <div className="pix-display text-xs ring-gradient mt-6 mb-3">BACK A TOKEN</div>
          <pre className="text-sm sm:text-base text-white/90 font-mono whitespace-pre-wrap leading-relaxed">
{`@RingProtocol back`}
          </pre>
          <div className="text-white/50 text-xs mt-1">
            Reply to any RING launch tweet. Your X followers determine your share weight.
          </div>
          <div className="mt-6 pix-display text-[10px] text-white/50 leading-relaxed">
            RULES //<br />
            • 1 launch per X account per day<br />
            • 5-minute backing window after launch<br />
            • Follower bonus capped at 50K followers<br />
            • Ring Match activates when 2 tokens launch from same thread within 10 min
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 pix-card pix-card-gold">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="pix-display text-sm sm:text-base ring-gradient">READY TO FIGHT?</div>
            <div className="text-white/60 mt-2 text-lg">Pick a tweet. Launch a token. Enter the ring.</div>
          </div>
          <Link href="/launch" className="pix-btn pix-btn-grad shrink-0">ENTER THE RING ▶</Link>
        </div>
      </section>
    </div>
  );
}
