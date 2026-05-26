// "oi" gradient brand mark. Two sizes: 22px for topbar, 36px for headers.

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md font-mono font-bold tracking-tighter2 text-canvas shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg,#5eb6ff,#a78bfa)",
        fontSize: Math.round(size * 0.46),
      }}
    >
      oi
    </span>
  );
}
