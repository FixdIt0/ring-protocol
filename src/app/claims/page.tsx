"use client";
import { Marquee } from "@/components/Marquee";

export default function ClaimsPage() {
  return (
    <div className="relative z-10 px-6 pt-10 pb-20 max-w-3xl mx-auto">
      <Marquee text="★ CLAIM YOUR FEES ★ CONNECT X ★ CONNECT WALLET ★" />

      <h1 className="pix-display text-xl sm:text-2xl text-center">
        CLAIM <span className="ring-gradient">YOUR FEES</span>
      </h1>
      <p className="text-center text-white/50 mt-4">
        Log in with X to see your claimable fees. Connect a wallet to withdraw.
      </p>

      <div className="mt-10 space-y-6">
        {/* Step 1: X Login */}
        <div className="pix-card">
          <div className="pix-display text-[10px] text-white/40 mb-3">STEP 1</div>
          <div className="pix-display text-base ring-gradient">CONNECT X ACCOUNT</div>
          <p className="text-white/50 mt-2">We check your X handle against all RING vaults to find your claimable fees.</p>
          <button className="pix-btn mt-4 w-full flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            SIGN IN WITH X
          </button>
        </div>

        {/* Step 2: Wallet */}
        <div className="pix-card pix-card-pink opacity-50">
          <div className="pix-display text-[10px] text-white/40 mb-3">STEP 2</div>
          <div className="pix-display text-base ring-gradient">CONNECT WALLET</div>
          <p className="text-white/50 mt-2">Connect your Solana wallet to receive the claimed SOL.</p>
          <button className="pix-btn mt-4 w-full" disabled>CONNECT WALLET</button>
        </div>

        {/* Claimable */}
        <div className="pix-card pix-card-gold opacity-50">
          <div className="pix-display text-[10px] text-white/40 mb-3">YOUR CLAIMS</div>
          <div className="text-center py-8">
            <div className="pix-display text-3xl ring-gradient">—</div>
            <div className="text-white/30 mt-2">Sign in to see claimable fees</div>
          </div>
        </div>
      </div>
    </div>
  );
}
