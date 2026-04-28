export function Marquee({ text }: { text: string }) {
  return (
    <div className="marquee mb-12 border-y border-white/15 py-2 pix-display text-[10px] text-white/50">
      <div className="marquee-track">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="mx-8">{text}</span>
        ))}
      </div>
    </div>
  );
}
