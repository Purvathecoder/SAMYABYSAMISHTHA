const ICONS: Record<string, React.ReactNode> = {
  earrings: (
    <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="30" r="9" />
      <path d="M50 39v10a12 12 0 0 0 12 12v0a12 12 0 0 1 12 12v6" />
      <circle cx="74" cy="79" r="5" fill="currentColor" stroke="none" />
    </g>
  ),
  bangles: (
    <g stroke="currentColor" strokeWidth="1.4" fill="none">
      <circle cx="50" cy="50" r="28" />
      <circle cx="50" cy="50" r="20" />
    </g>
  ),
  necklace: (
    <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
      <path d="M22 22c0 24 12 40 28 40s28-16 28-40" />
      <circle cx="50" cy="66" r="8" fill="currentColor" stroke="none" />
    </g>
  ),
  pendants: (
    <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 20v10" />
      <circle cx="50" cy="20" r="4" />
      <path d="M38 30h24l8 16-20 26-20-26z" />
    </g>
  ),
  gifting: (
    <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="24" y="42" width="52" height="34" rx="2" />
      <path d="M24 54h52" />
      <path d="M50 42v34" />
      <path d="M50 42c-6-14-24-14-24-2 0 6 10 2 24 2Z" />
      <path d="M50 42c6-14 24-14 24-2 0 6-10 2-24 2Z" />
    </g>
  ),
  default: (
    <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 40 50 22l20 18-8 36H38z" />
      <path d="M42 40h16" />
    </g>
  ),
};

export function ProductVisual({
  category,
  className = "",
  variant = "gold",
}: {
  category: string;
  className?: string;
  variant?: "gold" | "teal";
}) {
  const key = category.toLowerCase();
  const icon = ICONS[key] ?? ICONS.default;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        variant === "gold"
          ? "bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950"
          : "bg-gradient-to-br from-cream-dark to-cream"
      } ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(201,162,75,0.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(201,162,75,0.3), transparent 40%)",
        }}
      />
      <svg viewBox="0 0 100 100" className="relative w-2/5 h-2/5">
        <g style={{ color: variant === "gold" ? "#dbb662" : "#123832" }}>{icon}</g>
      </svg>
      <div className="pointer-events-none absolute inset-3 border border-gold-400/30 rounded-sm" />
    </div>
  );
}
