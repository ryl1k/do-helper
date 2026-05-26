export interface Question {
  id: string;
  number: number;
  text: string;
  options: string[];
  correct_indices: number[];
  categories: string[];        // topic slugs within the question's subject
  language: string;
  explanations?: string[];     // parallel to options
}

// Per-subject in-memory cache. The question bank is static after seeding, so one
// fetch per subject per page load is enough.
const _cache = new Map<string, Promise<Question[]>>();

export function loadQuestions(subjectSlug: string, force = false): Promise<Question[]> {
  if (!force && _cache.has(subjectSlug)) return _cache.get(subjectSlug)!;
  const p = (async () => {
    const r = await fetch(`/api/questions?subject=${encodeURIComponent(subjectSlug)}`, { cache: "no-store" });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || "failed to load questions");
    return j.questions as Question[];
  })();
  _cache.set(subjectSlug, p);
  return p;
}

export function clearQuestionsCache(subjectSlug?: string) {
  if (subjectSlug) _cache.delete(subjectSlug);
  else _cache.clear();
}

export function isUnanswerable(q: Question): boolean {
  return q.correct_indices.length === 0;
}

export const LETTERS = ["а", "б", "в", "г", "д", "е", "ж"];

export function letter(i: number): string {
  return LETTERS[i] ?? String(i + 1);
}
