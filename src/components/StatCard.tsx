const variants: Record<string, string> = {
  default: "pix-card",
  pink: "pix-card pix-card-pink",
  orange: "pix-card pix-card-orange",
  gold: "pix-card pix-card-gold",
  red: "pix-card pix-card-red",
};

export function StatCard({
  label, value, suffix, variant = "default",
}: {
  label: string; value: string; suffix?: string; variant?: string;
}) {
  return (
    <div className={variants[variant] ?? variants.default}>
      <div className="pix-display text-[9px] text-white/50">{label}</div>
      <div className="pix-display mt-2 leading-none">
        <span className="text-2xl ring-gradient">{value}</span>
        {suffix && <span className="text-xs text-white/60 ml-2 align-baseline">{suffix}</span>}
      </div>
    </div>
  );
}
