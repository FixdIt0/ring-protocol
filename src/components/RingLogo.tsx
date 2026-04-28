export function RingLogo({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
      role="img"
      aria-label="Ring"
    >
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3fb8ff" />
          <stop offset="35%" stopColor="#ff3fa8" />
          <stop offset="70%" stopColor="#ff7a3f" />
          <stop offset="100%" stopColor="#ffd83f" />
        </linearGradient>
      </defs>
      <g fill="url(#ring-grad)">
        {/* Ring ropes */}
        <rect x="80" y="120" width="352" height="16" rx="2" />
        <rect x="80" y="200" width="352" height="16" rx="2" />
        <rect x="80" y="280" width="352" height="16" rx="2" />
        {/* Corner posts */}
        <rect x="72" y="100" width="24" height="210" rx="2" />
        <rect x="416" y="100" width="24" height="210" rx="2" />
        {/* Platform */}
        <rect x="48" y="310" width="416" height="24" rx="2" />
        <rect x="64" y="334" width="384" height="12" rx="2" />
        {/* Gloves — left */}
        <circle cx="180" cy="400" r="40" />
        <rect x="160" y="430" width="40" height="30" rx="4" />
        {/* Gloves — right */}
        <circle cx="332" cy="400" r="40" />
        <rect x="312" y="430" width="40" height="30" rx="4" />
        {/* VS spark */}
        <rect x="248" y="380" width="16" height="40" rx="1" />
        <rect x="240" y="392" width="32" height="16" rx="1" />
      </g>
    </svg>
  );
}
