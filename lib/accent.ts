// Per-subject accent palette. Every subject picks ONE of these tokens; UI elements
// in /[subject]/* read the chosen accent via useAccent().
//
// Class strings must be literal so the Tailwind JIT picks them up — keep them
// fully spelled out, don't construct dynamically.

export const ACCENT_TOKENS = [
  "blue", "rose", "emerald", "amber", "violet", "cyan", "orange", "fuchsia", "teal", "indigo",
] as const;
export type AccentToken = (typeof ACCENT_TOKENS)[number];

export interface AccentClasses {
  // Solid primary action: filled button.
  cta: string;
  // Inverse text on cta background, used inside `cta` elements.
  ctaText: string;
  // Outlined / soft variant for secondary placement.
  soft: string;
  // Text-only link color.
  text: string;
  // Border-only highlight (focus rings, dashed boxes).
  border: string;
  // Soft tinted card border (used on subject hero/CTA panels).
  cardBorder: string;
  // Tinted card background.
  cardBg: string;
  // Inline dot indicator.
  dot: string;
  // Progress / score bar fill.
  bar: string;
  // Hover ring for outlined cards.
  hoverRing: string;
}

const PALETTE: Record<AccentToken, AccentClasses> = {
  blue: {
    cta: "bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-blue-50 hover:bg-blue-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20",
    text: "text-blue-600 dark:text-sky-400",
    border: "border-blue-500 dark:border-sky-500",
    cardBorder: "border-blue-200 dark:border-sky-500/30",
    cardBg: "bg-blue-50 dark:bg-sky-500/10",
    dot: "bg-blue-500 dark:bg-sky-400",
    bar: "bg-blue-600 dark:bg-sky-500",
    hoverRing: "hover:border-blue-300 dark:hover:border-sky-700",
  },
  rose: {
    cta: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500 dark:border-rose-500",
    cardBorder: "border-rose-200 dark:border-rose-500/30",
    cardBg: "bg-rose-50 dark:bg-rose-500/10",
    dot: "bg-rose-500 dark:bg-rose-400",
    bar: "bg-rose-600 dark:bg-rose-500",
    hoverRing: "hover:border-rose-300 dark:hover:border-rose-700",
  },
  emerald: {
    cta: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500 dark:border-emerald-500",
    cardBorder: "border-emerald-200 dark:border-emerald-500/30",
    cardBg: "bg-emerald-50 dark:bg-emerald-500/10",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    bar: "bg-emerald-600 dark:bg-emerald-500",
    hoverRing: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  amber: {
    cta: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500 dark:border-amber-500",
    cardBorder: "border-amber-200 dark:border-amber-500/30",
    cardBg: "bg-amber-50 dark:bg-amber-500/10",
    dot: "bg-amber-500 dark:bg-amber-400",
    bar: "bg-amber-600 dark:bg-amber-500",
    hoverRing: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  violet: {
    cta: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-violet-50 hover:bg-violet-100 dark:bg-violet-500/10 dark:hover:bg-violet-500/20",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500 dark:border-violet-500",
    cardBorder: "border-violet-200 dark:border-violet-500/30",
    cardBg: "bg-violet-50 dark:bg-violet-500/10",
    dot: "bg-violet-500 dark:bg-violet-400",
    bar: "bg-violet-600 dark:bg-violet-500",
    hoverRing: "hover:border-violet-300 dark:hover:border-violet-700",
  },
  cyan: {
    cta: "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500 dark:border-cyan-500",
    cardBorder: "border-cyan-200 dark:border-cyan-500/30",
    cardBg: "bg-cyan-50 dark:bg-cyan-500/10",
    dot: "bg-cyan-500 dark:bg-cyan-400",
    bar: "bg-cyan-600 dark:bg-cyan-500",
    hoverRing: "hover:border-cyan-300 dark:hover:border-cyan-700",
  },
  orange: {
    cta: "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500 dark:border-orange-500",
    cardBorder: "border-orange-200 dark:border-orange-500/30",
    cardBg: "bg-orange-50 dark:bg-orange-500/10",
    dot: "bg-orange-500 dark:bg-orange-400",
    bar: "bg-orange-600 dark:bg-orange-500",
    hoverRing: "hover:border-orange-300 dark:hover:border-orange-700",
  },
  fuchsia: {
    cta: "bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-fuchsia-50 hover:bg-fuchsia-100 dark:bg-fuchsia-500/10 dark:hover:bg-fuchsia-500/20",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-500 dark:border-fuchsia-500",
    cardBorder: "border-fuchsia-200 dark:border-fuchsia-500/30",
    cardBg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
    dot: "bg-fuchsia-500 dark:bg-fuchsia-400",
    bar: "bg-fuchsia-600 dark:bg-fuchsia-500",
    hoverRing: "hover:border-fuchsia-300 dark:hover:border-fuchsia-700",
  },
  teal: {
    cta: "bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-teal-50 hover:bg-teal-100 dark:bg-teal-500/10 dark:hover:bg-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500 dark:border-teal-500",
    cardBorder: "border-teal-200 dark:border-teal-500/30",
    cardBg: "bg-teal-50 dark:bg-teal-500/10",
    dot: "bg-teal-500 dark:bg-teal-400",
    bar: "bg-teal-600 dark:bg-teal-500",
    hoverRing: "hover:border-teal-300 dark:hover:border-teal-700",
  },
  indigo: {
    cta: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400",
    ctaText: "text-white dark:text-slate-950",
    soft: "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500 dark:border-indigo-500",
    cardBorder: "border-indigo-200 dark:border-indigo-500/30",
    cardBg: "bg-indigo-50 dark:bg-indigo-500/10",
    dot: "bg-indigo-500 dark:bg-indigo-400",
    bar: "bg-indigo-600 dark:bg-indigo-500",
    hoverRing: "hover:border-indigo-300 dark:hover:border-indigo-700",
  },
};

export const DEFAULT_ACCENT: AccentToken = "blue";

export function getAccent(token: string | null | undefined): AccentClasses {
  if (!token) return PALETTE[DEFAULT_ACCENT];
  return PALETTE[token as AccentToken] ?? PALETTE[DEFAULT_ACCENT];
}

export function normalizeAccent(token: string | null | undefined): AccentToken {
  if (!token) return DEFAULT_ACCENT;
  return (ACCENT_TOKENS as readonly string[]).includes(token) ? (token as AccentToken) : DEFAULT_ACCENT;
}
