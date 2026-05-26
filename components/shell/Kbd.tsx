// Tiny keyboard-shortcut chip. Used in topbar, CTAs, nav items.
// `inverse=true` flips the colors so it reads on cyan/accent backgrounds.

export function Kbd({
  children,
  inverse,
  className = "",
}: {
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <span className={`kbd ${inverse ? "kbd-inverse" : ""} ${className}`.trim()}>
      {children}
    </span>
  );
}
