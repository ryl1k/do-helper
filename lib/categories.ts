export const CATEGORIES = [
  "Постановка",
  "Ігрові задачі",
  "Одновимірна оптимізація",
  "Транспортна",
] as const;

export type Category = (typeof CATEGORIES)[number] | "Інше";

export const OTHER: Category = "Інше";

export const CATEGORY_DESCRIPTIONS: Record<(typeof CATEGORIES)[number], string> = {
  "Постановка":
    "General problem formulation, definitions, linear programming basics, simplex method, integer programming, convexity, basic feasible solutions.",
  "Ігрові задачі":
    "Game theory: matrix games, saddle points, mixed strategies, minimax, payoff matrices, dominant strategies.",
  "Одновимірна оптимізація":
    "Single-variable optimization: golden section, dichotomy, Fibonacci, parabolic interpolation, Nelder-Mead, unimodal functions, gradient methods.",
  "Транспортна":
    "Transportation problem: north-west corner, least cost, Vogel's approximation, potential method, balanced/unbalanced transport, supply/demand.",
};

export function categoryColor(c: string | null | undefined): string {
  switch (c) {
    case "Постановка": return "bg-sky-900/60 border-sky-700";
    case "Ігрові задачі": return "bg-rose-900/60 border-rose-700";
    case "Одновимірна оптимізація": return "bg-violet-900/60 border-violet-700";
    case "Транспортна": return "bg-emerald-900/60 border-emerald-700";
    default: return "bg-zinc-800/80 border-zinc-700";
  }
}
