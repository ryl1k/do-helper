"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase-client";
import { useSubjects } from "@/lib/subjects";

interface Parsed {
  text: string;
  options: string[];
  correct_indices: number[];
}

export default function ImportPage() {
  const subjects = useSubjects();
  const [subjectId, setSubjectId] = useState<string>("");
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<Parsed[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  async function parse() {
    if (!raw.trim()) return;
    setBusy(true); setErr(null); setParsed(null); setSavedCount(null);
    try {
      const sb = getSupabase();
      const { data: sess } = await sb.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Not signed in.");
      const r = await fetch("/api/admin/import/parse", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: raw }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "parse failed");
      const qs: Parsed[] = j.questions;
      setParsed(qs);
      setSelected(new Set(qs.map((_, i) => i)));
    } catch (e: any) { setErr(e?.message ?? String(e)); }
    finally { setBusy(false); }
  }

  async function save() {
    if (!parsed || !subjectId) return;
    setBusy(true); setErr(null);
    try {
      const sb = getSupabase();
      // Compute next number for this subject.
      const { data: maxRow } = await sb.from("questions")
        .select("number").eq("subject_id", subjectId)
        .order("number", { ascending: false }).limit(1).maybeSingle();
      let next = (maxRow?.number ?? 0) + 1;
      const rows = parsed
        .map((q, i) => ({ q, i }))
        .filter(({ i }) => selected.has(i))
        .map(({ q }) => ({
          subject_id: subjectId,
          number: next++,
          text: q.text,
          options: q.options,
          correct_indices: q.correct_indices,
          categories: [] as string[],
          language: "uk",
        }));
      if (rows.length === 0) { setBusy(false); return; }
      // Chunk inserts.
      const CHUNK = 100;
      for (let i = 0; i < rows.length; i += CHUNK) {
        const { error } = await sb.from("questions").insert(rows.slice(i, i + CHUNK));
        if (error) throw error;
      }
      setSavedCount(rows.length);
      setParsed(null); setRaw("");
    } catch (e: any) { setErr(e?.message ?? String(e)); }
    finally { setBusy(false); }
  }

  function toggleSel(i: number) {
    const n = new Set(selected); n.has(i) ? n.delete(i) : n.add(i); setSelected(n);
  }
  function selAll() { setSelected(new Set((parsed ?? []).map((_, i) => i))); }
  function selNone() { setSelected(new Set()); }

  return (
    <div className="px-6 sm:px-7 py-6 max-w-5xl">
      <div className="eyebrow">Адмін</div>
      <h1 className="text-[22px] font-semibold tracking-tighter2 mt-1">AI Import</h1>
      <p className="text-[13px] text-ink-dim mt-1 max-w-2xl leading-relaxed">
        Встав сирий текст з питаннями — Groq витягне структуровані MCQ. Підтримує Moodle-формат,
        нумеровані списки, довільний текст. Питання без явно позначеної відповіді отримають порожній
        <span className="text-cyan"> correct_indices: []</span> — заповниш потім вручну.
      </p>

      {err && <div className="mt-4 text-bad text-sm">{err}</div>}
      {savedCount !== null && (
        <div className="mt-4 panel border-good/30 bg-good/[0.06] p-3 text-[13px] text-good">
          Збережено {savedCount} питань.
        </div>
      )}

      <div className="mt-5 flex items-center gap-2.5">
        <div className="eyebrow">Предмет</div>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="bg-surface border border-line rounded-md px-3 py-1.5 text-[13px] outline-none focus:border-cyan"
        >
          <option value="">— обери —</option>
          {subjects?.map((s) => <option key={s.id} value={s.id}>{s.name_uk}</option>)}
        </select>
      </div>

      <div className="mt-4">
        <div className="eyebrow mb-1.5">Сирий текст</div>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={10}
          placeholder={`1. Що таке X?\n   а) ...\n   б) ... *правильна*\n   в) ...\n\n2. Який метод ...`}
          className="w-full bg-surface border border-line rounded-md px-3 py-2.5 text-[13px] resize-y outline-none focus:border-cyan"
        />
        <div className="mt-2 flex items-center gap-2.5">
          <button
            onClick={parse}
            disabled={busy || !raw.trim()}
            className="px-3.5 py-2 rounded-md bg-cyan text-canvas text-[12px] font-semibold disabled:opacity-50"
          >
            {busy && !parsed ? "Парсимо…" : "Розпарсити"}
          </button>
          <span className="text-[11px] text-ink-mute">~30к символів максимум</span>
        </div>
      </div>

      {parsed && parsed.length === 0 && (
        <div className="mt-6 panel p-6 text-center text-ink-mute">
          Питань не знайдено в тексті.
        </div>
      )}

      {parsed && parsed.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-medium">
              Знайдено {parsed.length} питань · обрано {selected.size}
            </h2>
            <div className="flex gap-2 text-[11px]">
              <button onClick={selAll} className="text-ink-dim hover:text-ink">усі</button>
              <span className="text-ink-mute">·</span>
              <button onClick={selNone} className="text-ink-dim hover:text-ink">жодне</button>
            </div>
          </div>
          <div className="panel divide-y divide-line overflow-hidden">
            {parsed.map((q, i) => (
              <ParsedRow key={i} q={q} selected={selected.has(i)} onToggle={() => toggleSel(i)} />
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <button
              onClick={save}
              disabled={busy || !subjectId || selected.size === 0}
              className="px-4 py-2 rounded-md bg-cyan text-canvas text-[12px] font-semibold disabled:opacity-50"
            >
              {busy ? "Зберігаємо…" : `Зберегти ${selected.size} питань`}
            </button>
            <span className="text-[11px] text-ink-mute">
              {subjectId ? "" : "Спочатку обери предмет."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ParsedRow({ q, selected, onToggle }: { q: Parsed; selected: boolean; onToggle: () => void }) {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-3 px-4 py-3 items-start">
      <button
        onClick={onToggle}
        className={"size-5 rounded border mt-0.5 flex items-center justify-center " + (selected ? "bg-cyan border-cyan" : "bg-surface2 border-line")}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 9 9">
            <path d="M1 4.5L3.5 7L8 1.5" stroke="#0a0b0d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <div>
        <div className="text-[13px]">{q.text}</div>
        <ul className="mt-1.5 space-y-0.5">
          {q.options.map((o, j) => {
            const correct = q.correct_indices.includes(j);
            return (
              <li key={j} className={"text-[12px] flex gap-2 " + (correct ? "text-good" : "text-ink-dim")}>
                <span className="text-ink-mute w-4">{String.fromCharCode(0x430 + j)}</span>
                <span>{o}</span>
                {correct && <span className="text-good">✓</span>}
              </li>
            );
          })}
        </ul>
        {q.correct_indices.length === 0 && (
          <div className="text-[11px] text-warn mt-1">⚠ Правильна відповідь не позначена</div>
        )}
      </div>
    </div>
  );
}
