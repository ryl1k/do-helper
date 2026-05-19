"use client";
import { useEffect, useMemo, useState } from "react";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { AnswerPicker } from "@/components/AnswerPicker";
import { CATEGORIES, OTHER, categoryColor } from "@/lib/categories";

type Q = {
  id: string;
  text: string;
  options: string[];
  language: string;
  category: string | null;
  created_at: string;
  image_count: number;
  image_url: string | null;
  tally: Record<number, number>;
  my_vote: number | null;
  consensus: number | null;
};
type Stats = {
  total_questions: number;
  total_images: number;
  total_duplicates: number;
};

export default function DbPage() {
  return <ApiKeyGate>{(key) => <DbView apiKey={key} />}</ApiKeyGate>;
}

function DbView({ apiKey }: { apiKey: string }) {
  const [data, setData] = useState<{ questions: Q[]; stats: Stats } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [recat, setRecat] = useState<string | null>(null);

  async function recategorize() {
    setRecat("Working…");
    try {
      let total = 0, totalCost = 0, remaining = 0;
      for (let i = 0; i < 50; i++) { // up to 50 batches of 25 = 1,250 questions
        const r = await fetch("/api/admin/recategorize", { method: "POST", headers: { "x-api-key": apiKey } });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "failed");
        total += j.updated; totalCost += j.cost_usd; remaining = j.remaining;
        setRecat(`Updated ${total} (cost $${totalCost.toFixed(4)}), ${remaining} left…`);
        if (j.updated === 0) break;
      }
      setRecat(`Done. Updated ${total}, spent $${totalCost.toFixed(4)}.`);
      await load();
    } catch (e: any) {
      setRecat(`Error: ${e?.message ?? e}`);
    }
  }

  async function load() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/questions?limit=500", { headers: { "x-api-key": apiKey } });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "request failed");
      setData(j);
    } catch (e: any) { setErr(String(e?.message ?? e)); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [apiKey]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.questions.filter((it) => {
      if (activeCat) {
        const cat = it.category ?? OTHER;
        if (cat !== activeCat) return false;
      }
      if (q && !it.text.toLowerCase().includes(q) && !it.options.some((o) => o.toLowerCase().includes(q))) {
        return false;
      }
      return true;
    });
  }, [data, query, activeCat]);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const q of data?.questions ?? []) {
      const c = q.category ?? OTHER;
      m[c] = (m[c] ?? 0) + 1;
    }
    return m;
  }, [data]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Questions</h1>
        <div className="flex items-center gap-4 text-sm">
          <button onClick={load} className="opacity-70 hover:opacity-100 underline">refresh</button>
          <a href="/" className="opacity-70 hover:opacity-100 underline">← upload</a>
        </div>
      </header>

      {err && <div className="text-red-400 text-sm">{err}</div>}

      {data && (
        <>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex gap-4 opacity-80">
              <span><b>{data.stats.total_questions}</b> unique</span>
              <span><b>{data.stats.total_images}</b> uploads</span>
              <span><b>{data.stats.total_duplicates}</b> dupes</span>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search…"
              className="ml-auto bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm w-64"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CategoryPill label="All" count={data.questions.length} active={activeCat === null} onClick={() => setActiveCat(null)} />
            {[...CATEGORIES, OTHER].map((c) => (
              <CategoryPill
                key={c}
                label={c}
                count={catCounts[c] ?? 0}
                color={categoryColor(c)}
                active={activeCat === c}
                onClick={() => setActiveCat(activeCat === c ? null : c)}
              />
            ))}
            <button
              onClick={recategorize}
              className="ml-auto text-xs px-3 py-1 rounded border border-zinc-700 hover:border-zinc-500 opacity-70 hover:opacity-100"
              title="Classify any questions that don't have a category yet"
            >
              backfill categories
            </button>
          </div>
          {recat && <div className="text-xs opacity-70">{recat}</div>}

          <ol className="space-y-3 list-decimal list-outside ml-6 marker:opacity-40 marker:text-sm">
            {filtered.map((q) => (
              <li key={q.id}>
                <div className="border border-zinc-800 rounded-lg p-4 -ml-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-base leading-snug">{q.text}</div>
                    <span
                      className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border shrink-0 ${categoryColor(q.category)}`}
                    >
                      {q.category ?? OTHER}
                    </span>
                  </div>
                  <AnswerPicker
                    apiKey={apiKey}
                    questionId={q.id}
                    options={q.options}
                    initialTally={q.tally}
                    initialMyVote={q.my_vote}
                  />
                  <div className="mt-3 flex items-center gap-3 text-xs opacity-50">
                    <span>{q.language}</span>
                    {q.image_count > 1 && <span>seen ×{q.image_count}</span>}
                    {q.image_url && (
                      <a href={q.image_url} target="_blank" rel="noreferrer" className="underline">
                        original
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {filtered.length === 0 && !loading && (
            <div className="opacity-60 text-sm text-center py-10">
              {query ? "No matches." : "No questions yet. Upload some."}
            </div>
          )}
        </>
      )}

      {loading && <div className="opacity-60 text-sm text-center py-10">Loading…</div>}
    </main>
  );
}

function CategoryPill({
  label, count, active, color, onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  const base = "px-3 py-1 rounded-full text-xs border transition";
  const tone = active
    ? color ?? "bg-zinc-100 text-zinc-900 border-zinc-100"
    : "border-zinc-700 bg-zinc-900 hover:border-zinc-500";
  return (
    <button onClick={onClick} className={`${base} ${tone}`}>
      {label} <span className="opacity-60 ml-1">{count}</span>
    </button>
  );
}
