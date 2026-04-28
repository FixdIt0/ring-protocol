"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    const short = publicKey.toBase58().slice(0, 4) + "…" + publicKey.toBase58().slice(-4);
    return (
      <button onClick={() => disconnect()} className="pix-btn pix-btn-grad" style={{ padding: "8px 16px", fontSize: 10 }}>
        {short}
      </button>
    );
  }

  return (
    <button onClick={() => setVisible(true)} className="pix-btn pix-btn-grad" style={{ padding: "8px 16px", fontSize: 10 }}>
      CONNECT
    </button>
  );
}
