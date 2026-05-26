// Topics (formerly "categories") for a given subject.
// Loaded from the DB once per page and cached in-memory.
// The color tokens come from the DB; the actual Tailwind classes live here so
// the JIT can see them (every class string must appear literally in source).

export interface Topic {
  slug: string;          // stable id within the subject
  name: string;          // long display name
  short_name?: string;   // short label for pills/lists
  hint?: string;         // English hint sent to the LLM
  color_token: string;   // 'slate' | 'blue' | 'indigo' | …
  sort_order: number;
}

export interface SubjectTopics {
  subject_slug: string;
  topics: Topic[];
  bySlug: Map<string, Topic>;
}

// Catch-all bucket for questions with no topic match.
export const OTHER_SLUG = "__other__";
export const OTHER_NAME = "Інше";

const OTHER_TOPIC: Topic = {
  slug: OTHER_SLUG,
  name: OTHER_NAME,
  short_name: OTHER_NAME,
  color_token: "slate",
  sort_order: 9999,
};

const _cache = new Map<string, Promise<SubjectTopics>>();

export function loadTopics(subjectSlug: string): Promise<SubjectTopics> {
  if (!_cache.has(subjectSlug)) {
    _cache.set(subjectSlug, fetchTopics(subjectSlug));
  }
  return _cache.get(subjectSlug)!;
}

export function clearTopicsCache(subjectSlug?: string) {
  if (subjectSlug) _cache.delete(subjectSlug);
  else _cache.clear();
}

async function fetchTopics(subjectSlug: string): Promise<SubjectTopics> {
  const r = await fetch(`/api/topics?subject=${encodeURIComponent(subjectSlug)}`, { cache: "no-store" });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "failed to load topics");
  const topics = (j.topics as Topic[]).sort((a, b) => a.sort_order - b.sort_order);
  const bySlug = new Map(topics.map((t) => [t.slug, t]));
  return { subject_slug: subjectSlug, topics, bySlug };
}

// ---------- helpers used by UI ---------------------------------------------

// Returns the displayed list for a question — never empty. If no topics, falls
// back to a single virtual "Other" bucket so filters/counts still work.
export function effectiveTopicSlugs(slugs: readonly string[] | undefined): string[] {
  if (slugs && slugs.length > 0) return [...slugs];
  return [OTHER_SLUG];
}

export function getTopic(st: SubjectTopics, slug: string): Topic {
  if (slug === OTHER_SLUG) return OTHER_TOPIC;
  return st.bySlug.get(slug) ?? { ...OTHER_TOPIC, slug, name: slug, short_name: slug };
}

export function topicShortLabel(st: SubjectTopics, slug: string): string {
  const t = getTopic(st, slug);
  return t.short_name?.trim() || t.name;
}

export function topicName(st: SubjectTopics, slug: string): string {
  return getTopic(st, slug).name;
}

// ---------- styling --------------------------------------------------------
// All Tailwind classes used here must appear in source (literal strings)
// so the JIT picks them up. lib/**/*.{ts,tsx} is already in tailwind.config.ts content.

type Style = { bg: string; text: string; border: string; dot: string };

const STYLES: Record<string, Style> = {
  slate: {
    bg: "bg-slate-200 dark:bg-slate-800",
    text: "text-slate-800 dark:text-slate-200",
    border: "border-slate-300 dark:border-slate-700",
    dot: "bg-slate-500 dark:bg-slate-400",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-950/50",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-950/50",
    text: "text-indigo-800 dark:text-indigo-300",
    border: "border-indigo-300 dark:border-indigo-800",
    dot: "bg-indigo-500",
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-950/50",
    text: "text-teal-800 dark:text-teal-300",
    border: "border-teal-300 dark:border-teal-800",
    dot: "bg-teal-500",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-950/50",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  violet: {
    bg: "bg-violet-100 dark:bg-violet-950/50",
    text: "text-violet-800 dark:text-violet-300",
    border: "border-violet-300 dark:border-violet-800",
    dot: "bg-violet-500",
  },
  fuchsia: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-950/50",
    text: "text-fuchsia-800 dark:text-fuchsia-300",
    border: "border-fuchsia-300 dark:border-fuchsia-800",
    dot: "bg-fuchsia-500",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-950/50",
    text: "text-rose-800 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-800",
    dot: "bg-rose-500",
  },
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-950/50",
    text: "text-cyan-800 dark:text-cyan-300",
    border: "border-cyan-300 dark:border-cyan-800",
    dot: "bg-cyan-500",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-950/50",
    text: "text-orange-800 dark:text-orange-300",
    border: "border-orange-300 dark:border-orange-800",
    dot: "bg-orange-500",
  },
};

const FALLBACK: Style = STYLES.slate;

export const COLOR_TOKENS = Object.keys(STYLES) as readonly string[];

export function topicStyle(st: SubjectTopics, slug: string): Style {
  const t = getTopic(st, slug);
  return STYLES[t.color_token] ?? FALLBACK;
}

export function topicBadgeClass(st: SubjectTopics, slug: string): string {
  const s = topicStyle(st, slug);
  return `${s.bg} ${s.text} ${s.border}`;
}

export function topicDotClass(st: SubjectTopics, slug: string): string {
  return topicStyle(st, slug).dot;
}
