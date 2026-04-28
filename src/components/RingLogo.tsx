/* eslint-disable @next/next/no-img-element */
export function RingLogo({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="RING"
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "auto" }}
    />
  );
}
