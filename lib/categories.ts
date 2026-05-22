// The 9 topic groups for the operations-research test bank.
// One question can belong to multiple groups.
export const CATEGORIES = [
  "Загальні питання ДО",
  "Лінійне програмування і симплекс-метод",
  "Двоїстість у ЛП",
  "Транспортна задача",
  "Дискретне ЛП",
  "Нелінійне програмування (методи, теореми, умови)",
  "Одновимірна оптимізація (три групи методів)",
  "Багатовимірна оптимізація (методи прямого пошуку, градієнтні, квазіньютонівські)",
  "Ігрові методи у ДО (класифікація ігор, стратегії, критерії)",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Catch-all bucket for questions the LLM couldn't slot into any of the 9 above,
// and for any question whose categories[] ended up empty.
export const OTHER = "Інше";
export const ALL_CATEGORIES = [...CATEGORIES, OTHER] as const;
export type AllCategory = (typeof ALL_CATEGORIES)[number];

// A question always has at least one effective category. Empty -> ["Інше"].
export function effectiveCategories(cats: readonly string[]): string[] {
  return cats.length > 0 ? [...cats] : [OTHER];
}

// Optional short labels for tight spaces (pills, lists).
export const CATEGORY_SHORT: Record<Category, string> = {
  "Загальні питання ДО": "Загальні питання",
  "Лінійне програмування і симплекс-метод": "ЛП · симплекс",
  "Двоїстість у ЛП": "Двоїстість",
  "Транспортна задача": "Транспортна",
  "Дискретне ЛП": "Дискретне ЛП",
  "Нелінійне програмування (методи, теореми, умови)": "Нелінійне",
  "Одновимірна оптимізація (три групи методів)": "Одновимірна",
  "Багатовимірна оптимізація (методи прямого пошуку, градієнтні, квазіньютонівські)": "Багатовимірна",
  "Ігрові методи у ДО (класифікація ігор, стратегії, критерії)": "Ігрові методи",
};

// Short label registry includes the catch-all bucket too.
const SHORT_OTHER: Record<string, string> = { ...CATEGORY_SHORT, [OTHER]: OTHER };

// English hints sent to the LLM so it understands what each Ukrainian label means.
export const CATEGORY_HINTS: Record<Category, string> = {
  "Загальні питання ДО":
    "general operations-research questions: problem formulation, classifications, modelling, solution stages, criteria, terminology",
  "Лінійне програмування і симплекс-метод":
    "linear programming, canonical/standard form, simplex method, basic feasible solutions, pivoting",
  "Двоїстість у ЛП":
    "LP duality, primal-dual relationships, complementary slackness, dual variables, dual problem construction",
  "Транспортна задача":
    "transportation problem, north-west corner, minimum cost, Vogel approximation, potentials (MODI) method, Hungarian/assignment, balanced/unbalanced supply-demand",
  "Дискретне ЛП":
    "integer/discrete linear programming, branch and bound, cutting planes, Gomory, knapsack, 0/1 variables",
  "Нелінійне програмування (методи, теореми, умови)":
    "nonlinear programming, Kuhn-Tucker, Lagrange, convexity, concavity, optimality conditions for NLP, penalty methods",
  "Одновимірна оптимізація (три групи методів)":
    "single-variable optimization: golden section, dichotomy, Fibonacci, Newton, Newton-Raphson, Sven, Powell, parabolic interpolation, mid-point, interval-elimination methods",
  "Багатовимірна оптимізація (методи прямого пошуку, градієнтні, квазіньютонівські)":
    "multivariable optimization: Hooke-Jeeves, Nelder-Mead (simplex), steepest descent, conjugate gradients, BFGS, DFP, quasi-Newton",
  "Ігрові методи у ДО (класифікація ігор, стратегії, критерії)":
    "game theory: matrix games, pure/mixed strategies, saddle point, minimax, maximin, Wald/Hurwicz/Savage criteria, payoff matrix, dominance",
};

// Distinct hue per category, paired light/dark so cards/badges read the same
// in both themes. Used on subtle badges, pill backgrounds when active, and dots.
const STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Загальні питання ДО": {
    bg: "bg-slate-100 dark:bg-slate-800/60",
    text: "text-slate-700 dark:text-slate-200",
    border: "border-slate-300 dark:border-slate-700",
    dot: "bg-slate-500",
  },
  "Лінійне програмування і симплекс-метод": {
    bg: "bg-blue-100 dark:bg-blue-950/50",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  "Двоїстість у ЛП": {
    bg: "bg-indigo-100 dark:bg-indigo-950/50",
    text: "text-indigo-800 dark:text-indigo-300",
    border: "border-indigo-300 dark:border-indigo-800",
    dot: "bg-indigo-500",
  },
  "Транспортна задача": {
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  "Дискретне ЛП": {
    bg: "bg-teal-100 dark:bg-teal-950/50",
    text: "text-teal-800 dark:text-teal-300",
    border: "border-teal-300 dark:border-teal-800",
    dot: "bg-teal-500",
  },
  "Нелінійне програмування (методи, теореми, умови)": {
    bg: "bg-amber-100 dark:bg-amber-950/50",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  "Одновимірна оптимізація (три групи методів)": {
    bg: "bg-violet-100 dark:bg-violet-950/50",
    text: "text-violet-800 dark:text-violet-300",
    border: "border-violet-300 dark:border-violet-800",
    dot: "bg-violet-500",
  },
  "Багатовимірна оптимізація (методи прямого пошуку, градієнтні, квазіньютонівські)": {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-950/50",
    text: "text-fuchsia-800 dark:text-fuchsia-300",
    border: "border-fuchsia-300 dark:border-fuchsia-800",
    dot: "bg-fuchsia-500",
  },
  "Ігрові методи у ДО (класифікація ігор, стратегії, критерії)": {
    bg: "bg-rose-100 dark:bg-rose-950/50",
    text: "text-rose-800 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-800",
    dot: "bg-rose-500",
  },
  "Інше": {
    bg: "bg-slate-100 dark:bg-slate-800/60",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

const FALLBACK = {
  bg: "bg-slate-100 dark:bg-slate-800/60",
  text: "text-slate-700 dark:text-slate-300",
  border: "border-slate-300 dark:border-slate-700",
  dot: "bg-slate-400",
};

export function categoryStyle(c: string | null | undefined) {
  if (!c) return FALLBACK;
  return STYLES[c] ?? FALLBACK;
}

// All three classes joined (for badges).
export function categoryBadgeClass(c: string | null | undefined): string {
  const s = categoryStyle(c);
  return `${s.bg} ${s.text} ${s.border}`;
}

// Just the dot color (for compact lists).
export function categoryDotClass(c: string | null | undefined): string {
  return categoryStyle(c).dot;
}

// Short label fallback to full. Knows about "Інше".
export function shortLabel(c: string): string {
  return SHORT_OTHER[c] ?? c;
}
