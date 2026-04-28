import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-20 mt-16 px-6 py-8 border-t border-white/10">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="pix-display text-[9px] text-white/40">
          RING // BUILT ON{" "}
          <a href="https://printr.money" target="_blank" rel="noreferrer" className="pix-link ring-gradient">
            PRINTR
          </a>{" "}
          // SOLANA ONLY
        </div>
        <div className="flex items-center gap-4 pix-display text-[9px] text-white/40">
          <span>FEE TX: ON-CHAIN</span>
          <span>VAULT: CUSTODIAL</span>
          <Link href="/tokens" className="pix-link">TOKENS</Link>
        </div>
      </div>
    </footer>
  );
}
