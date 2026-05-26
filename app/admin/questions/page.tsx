"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase-client";
import { useSubjects } from "@/lib/subjects";
import { loadTopics, topicShortLabel, topicDotClass, type SubjectTopics } from "@/lib/topics";

interface QRow {
  id: string;
  number: number;
  text: string;
  options: string[];
  correct_indices: number[];
  categories: string[];
  subject_id: string;
}

export default function AdminQuestionsPage() {
  const subjects = useSubjects();
  const [subjectId, setSubjectId] = useState<string>("");
  const [subjectSlug, setSubjectSlug] = useState<string>("");
  const [rows, setRows] = useState<QRow[] | null>(null);
  const [topics, setTopics] = useState<SubjectTopics | null>(null);
  const [editing, setEditing] = useState<QRow | null>(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (subjects && subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id);
      setSubjectSlug(subjects[0].slug);
    }
  }, [subjects, subjectId]);

  const load = useCallback(async () => {
    if (!subjectId || !subjectSlug) return;
    const sb = getSupabase();
    const [qres, tres] = await Promise.all([
      sb.from("questions")
        .select("id, number, text, options, correct_indices, categories, subject_id")
        .eq("subject_id", subjectId)
        .order("number")
        .limit(500),
      loadTopics(subjectSlug),
    ]);
    if (qres.error) { setErr(qres.error.message); return; }
    setRows(qres.data as QRow[]);
    setTopics(tres);
  }, [subjectId, subjectSlug]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.text.toLowerCase().includes(q) || r.number.toString() === q);
  }, [rows, search]);

  async function save(r: QRow) {
    setBusy(true); setErr(null);
    try {
      const { error } = await getSupabase().from("questions").update({
        text: r.text.trim(),
        options: r.options,
        correct_indices: r.correct_indices,
        categories: r.categories,
      }).eq("id", r.id);
      if (error) throw error;
      await load();
      setEditing(null);
    } catch (e: any) { setErr(e?.message ?? String(e)); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm("Видалити питання назавжди?")) return;
    const { error } = await getSupabase().from("questions").delete().eq("id", id);
    if (error) { setErr(error.message); return; }
    await load();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] min-h-full">
      <div className="px-6 sm:px-7 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="eyebrow">{subjects?.find((s) => s.id === subjectId)?.name_uk ?? "Адмін"}</div>
            <h1 className="text-[22px] font-semibold tracking-tighter2 mt-1">Питання · {rows?.length ?? 0}</h1>
          </div>
          <select
            value={subjectId}
            onChange={(e) => {
              const next = subjects?.find((s) => s.id === e.target.value);
              if (next) { setSubjectId(next.id); setSubjectSlug(next.slug); setRows(null); setTopics(null); setEditing(null); }
            }}
            className="bg-surface border border-line rounded-md px-3 py-1.5 text-[12px] text-ink outline-none focus:border-cyan"
          >
            {subjects?.map((s) => (<option key={s.id} value={s.id}>{s.name_uk}</option>))}
          </select>
        </div>

        <div className="mb-3 flex gap-2.5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук по тексту або №…"
            className="flex-1 h-8 bg-surface border border-line rounded-md px-3 text-[13px] outline-none focus:border-cyan"
          />
        </div>

        {err && <div className="text-bad text-sm mb-3">{err}</div>}
        {!rows && <div className="text-ink-mute text-sm">Завантаження…</div>}
        {rows && (
          <div className="panel divide-y divide-line overflow-hidden">
            {filtered.slice(0, 200).map((q) => {
              const firstCat = q.categories[0] ?? "";
              return (
                <button
                  key={q.id}
                  onClick={() => setEditing(q)}
                  className="grid grid-cols-[40px_1fr_140px] gap-3 px-4 py-3 items-center hover:bg-surface text-left transition-colors"
                >
                  <span className="text-[11px] text-ink-mute">#{q.number}</span>
                  <span className="text-[13px] truncate">{q.text}</span>
                  {topics && firstCat && (
                    <span className="text-[11px] text-ink-dim inline-flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${topicDotClass(topics, firstCat)}`} />
                      <span className="truncate">{topicShortLabel(topics, firstCat)}</span>
                    </span>
                  )}
                </button>
              );
            })}
            {filtered.length > 200 && (
              <div className="px-4 py-3 text-[11px] text-ink-mute">показано перші 200 з {filtered.length}</div>
            )}
          </div>
        )}
      </div>

      <aside className="border-t lg:border-t-0 lg:border-l border-line p-6 bg-surface">
        {editing ? (
          <QuestionEditor
            row={editing}
            topics={topics}
            onChange={setEditing}
            onSave={() => save(editing)}
            onCancel={() => setEditing(null)}
            onDelete={() => remove(editing.id)}
            busy={busy}
          />
        ) : (
          <div className="text-[13px] text-ink-mute">Обери питання зі списку.</div>
        )}
      </aside>
    </div>
  );
}

function QuestionEditor({
  row, topics, onChange, onSave, onCancel, onDelete, busy,
}: {
  row: QRow;
  topics: SubjectTopics | null;
  onChange: (r: QRow) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  function updateOption(i: number, value: string) {
    const next = [...row.options]; next[i] = value;
    onChange({ ...row, options: next });
  }
  function toggleCorrect(i: number) {
    const set = new Set(row.correct_indices);
    set.has(i) ? set.delete(i) : set.add(i);
    onChange({ ...row, correct_indices: [...set].sort((a, b) => a - b) });
  }
  function toggleCat(slug: string) {
    const set = new Set(row.categories);
    set.has(slug) ? set.delete(slug) : set.add(slug);
    onChange({ ...row, categories: [...set] });
  }
  function addOption() {
    onChange({ ...row, options: [...row.options, ""] });
  }
  function removeOption(i: number) {
    const next = row.options.filter((_, j) => j !== i);
    const correct = row.correct_indices.filter((j) => j !== i).map((j) => (j > i ? j - 1 : j));
    onChange({ ...row, options: next, correct_indices: correct });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="eyebrow">Редагування · #{row.number}</div>
        </div>
        <button onClick={onCancel} className="text-[11px] text-ink-mute hover:text-ink">закрити</button>
      </div>
      <div>
        <div className="eyebrow mb-1.5">Питання</div>
        <textarea
          value={row.text}
          onChange={(e) => onChange({ ...row, text: e.target.value })}
          rows={3}
          className="qe-input resize-y"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="eyebrow">Варіанти · клік на пілюлю щоб відмітити правильні</div>
          <button onClick={addOption} className="text-[10px] text-cyan hover:underline">+ варіант</button>
        </div>
        <div className="space-y-1.5">
          {row.options.map((opt, i) => {
            const correct = row.correct_indices.includes(i);
            return (
              <div key={i} className={"flex items-center gap-2 px-2 py-1.5 rounded-md border " + (correct ? "border-good bg-good/[0.06]" : "border-line bg-canvas")}>
                <button
                  onClick={() => toggleCorrect(i)}
                  className={"size-5 rounded shrink-0 flex items-center justify-center text-[10px] " + (correct ? "bg-good text-canvas" : "bg-surface2 text-ink-dim")}
                >
                  {String.fromCharCode(0x430 + i)}
                </button>
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="qe-input flex-1 border-0 bg-transparent p-1"
                />
                <button onClick={() => removeOption(i)} className="text-ink-mute hover:text-bad text-xs">×</button>
              </div>
            );
          })}
        </div>
      </div>
      {topics && (
        <div>
          <div className="eyebrow mb-1.5">Теми</div>
          <div className="flex flex-wrap gap-1.5">
            {topics.topics.map((t) => {
              const on = row.categories.includes(t.slug);
              return (
                <button
                  key={t.slug}
                  onClick={() => toggleCat(t.slug)}
                  className={"text-[11px] px-2 py-0.5 rounded-full border " + (on ? "bg-cyan-soft border-cyan text-cyan" : "border-line text-ink-dim hover:text-ink hover:border-lineStrong")}
                >
                  <span className={`inline-block size-1 rounded-full ${topicDotClass(topics, t.slug)} mr-1`} />
                  {topicShortLabel(topics, t.slug)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button onClick={onSave} disabled={busy} className="flex-1 px-3 py-2 rounded-md bg-cyan text-canvas text-[12px] font-semibold disabled:opacity-50">
          Зберегти
        </button>
        <button onClick={onDelete} className="px-3 py-2 rounded-md border border-bad/40 text-bad text-[12px] hover:bg-bad/[0.08]">
          Видалити
        </button>
      </div>

      <style jsx>{`
        .qe-input {
          width: 100%;
          background: #0a0b0d;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 13px;
          color: #e6e8ec;
          outline: none;
          font-family: inherit;
        }
        .qe-input:focus { border-color: #5eb6ff; }
      `}</style>
    </div>
  );
}
