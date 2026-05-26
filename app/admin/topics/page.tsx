"use client";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase-client";
import { useSubjects, type Subject } from "@/lib/subjects";
import { clearTopicsCache } from "@/lib/topics";
import { COLOR_TOKENS } from "@/lib/topics";

interface Topic {
  id?: string;
  subject_id: string;
  slug: string;
  name: string;
  short_name: string | null;
  hint: string | null;
  color_token: string;
  sort_order: number;
}

const COLOR_BG: Record<string, string> = {
  slate: "bg-slate-500", blue: "bg-blue-500", indigo: "bg-indigo-500",
  emerald: "bg-emerald-500", teal: "bg-teal-500", amber: "bg-amber-500",
  violet: "bg-violet-500", fuchsia: "bg-fuchsia-500", rose: "bg-rose-500",
  cyan: "bg-cyan-500", orange: "bg-orange-500",
};

export default function AdminTopicsPage() {
  const subjects = useSubjects();
  const [subjectId, setSubjectId] = useState<string>("");
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (subjects && subjects.length > 0 && !subjectId) setSubjectId(subjects[0].id);
  }, [subjects, subjectId]);

  const load = useCallback(async () => {
    if (!subjectId) return;
    const { data, error } = await getSupabase()
      .from("subject_topics")
      .select("id, subject_id, slug, name, short_name, hint, color_token, sort_order")
      .eq("subject_id", subjectId)
      .order("sort_order");
    if (error) setErr(error.message);
    else setTopics(data as Topic[]);
  }, [subjectId]);

  useEffect(() => { load(); }, [load]);

  async function save(t: Topic) {
    setBusy(true); setErr(null);
    try {
      const sb = getSupabase();
      const payload = {
        subject_id: t.subject_id,
        slug: t.slug.trim().toLowerCase(),
        name: t.name.trim(),
        short_name: t.short_name?.trim() || null,
        hint: t.hint?.trim() || null,
        color_token: t.color_token,
        sort_order: t.sort_order,
      };
      if (t.id) {
        const { error } = await sb.from("subject_topics").update(payload).eq("id", t.id);
        if (error) throw error;
      } else {
        const { error } = await sb.from("subject_topics").insert(payload);
        if (error) throw error;
      }
      clearTopicsCache();
      await load();
      setEditing(null);
    } catch (e: any) { setErr(e?.message ?? String(e)); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm("Видалити тему? Питання залишаться, але втратять цю мітку.")) return;
    const { error } = await getSupabase().from("subject_topics").delete().eq("id", id);
    if (error) { setErr(error.message); return; }
    clearTopicsCache();
    await load();
  }

  const subj = subjects?.find((s: Subject) => s.id === subjectId);

  return (
    <div className="grid lg:grid-cols-[1fr_380px] min-h-full">
      <div className="px-6 sm:px-7 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="eyebrow">{subj?.name_uk ?? "Адмін"}</div>
            <h1 className="text-[22px] font-semibold tracking-tighter2 mt-1">Теми · {topics?.length ?? 0}</h1>
          </div>
          <div className="flex gap-2">
            <select
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setTopics(null); setEditing(null); }}
              className="bg-surface border border-line rounded-md px-3 py-1.5 text-[12px] text-ink outline-none focus:border-cyan"
            >
              {subjects?.map((s) => (
                <option key={s.id} value={s.id}>{s.name_uk}</option>
              ))}
            </select>
            <button
              disabled={!subjectId}
              onClick={() => setEditing({
                subject_id: subjectId, slug: "", name: "", short_name: "", hint: "",
                color_token: "blue", sort_order: (topics?.length ?? 0) + 1,
              })}
              className="px-3 py-1.5 rounded-md bg-cyan text-canvas text-[12px] font-semibold"
            >
              + Тема
            </button>
          </div>
        </div>

        {err && <div className="text-bad text-sm mb-3">{err}</div>}
        {!topics && subjectId && <div className="text-ink-mute text-sm">Завантаження…</div>}
        {topics && topics.length === 0 && (
          <div className="panel p-10 text-center">
            <div className="text-[13px] text-ink-dim">Жодної теми для цього предмета.</div>
          </div>
        )}
        {topics && topics.length > 0 && (
          <div className="panel divide-y divide-line overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_120px_60px_24px] gap-3 px-4 py-2 eyebrow border-b border-line">
              <span>#</span><span>Назва</span><span>Slug</span><span>Колір</span><span></span>
            </div>
            {topics.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setEditing(t)}
                className="grid grid-cols-[40px_1fr_120px_60px_24px] gap-3 px-4 py-3 items-center hover:bg-surface transition-colors text-left"
              >
                <span className="text-[11px] text-ink-mute">{i + 1}</span>
                <span className="text-[13px] flex items-center gap-2">
                  <span className={`size-2 rounded-full ${COLOR_BG[t.color_token] ?? "bg-slate-500"}`} />
                  <span className="truncate">{t.name}</span>
                </span>
                <span className="text-[11px] text-ink-mute">{t.slug}</span>
                <span className="text-[11px] text-ink-mute">{t.color_token}</span>
                <span className="text-ink-mute">›</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <aside className="border-t lg:border-t-0 lg:border-l border-line p-6 bg-surface lg:sticky lg:top-0 lg:self-start lg:max-h-[calc(100vh-44px)] lg:overflow-y-auto">
        {editing ? (
          <TopicEditor
            topic={editing}
            onChange={setEditing}
            onSave={() => save(editing)}
            onCancel={() => setEditing(null)}
            onDelete={editing.id ? () => remove(editing.id!) : undefined}
            busy={busy}
          />
        ) : (
          <div className="text-[13px] text-ink-mute">Обери тему зі списку.</div>
        )}
      </aside>
    </div>
  );
}

function TopicEditor({
  topic, onChange, onSave, onCancel, onDelete, busy,
}: {
  topic: Topic;
  onChange: (t: Topic) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  busy: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">{topic.id ? "Редагування" : "Нова тема"}</div>
        <button onClick={onCancel} className="text-[11px] text-ink-mute hover:text-ink">закрити</button>
      </div>
      <FieldRow label="Slug">
        <input
          value={topic.slug}
          onChange={(e) => onChange({ ...topic, slug: e.target.value })}
          placeholder="html_css"
          className="ai-input"
        />
      </FieldRow>
      <FieldRow label="Назва">
        <input
          value={topic.name}
          onChange={(e) => onChange({ ...topic, name: e.target.value })}
          placeholder="HTML і CSS"
          className="ai-input"
        />
      </FieldRow>
      <FieldRow label="Коротка назва" hint="Для пілюль та тісних місць">
        <input
          value={topic.short_name ?? ""}
          onChange={(e) => onChange({ ...topic, short_name: e.target.value })}
          placeholder="HTML/CSS"
          className="ai-input"
        />
      </FieldRow>
      <FieldRow label="Hint (English)" hint="Передається LLM для класифікації">
        <textarea
          value={topic.hint ?? ""}
          onChange={(e) => onChange({ ...topic, hint: e.target.value })}
          rows={3}
          placeholder="HTML structure, CSS selectors, responsive design…"
          className="ai-input resize-y"
        />
      </FieldRow>
      <FieldRow label="Колір">
        <div className="grid grid-cols-6 gap-1.5">
          {COLOR_TOKENS.map((tok) => (
            <button
              key={tok}
              onClick={() => onChange({ ...topic, color_token: tok })}
              className={`h-7 rounded ${COLOR_BG[tok] ?? "bg-slate-500"} ${topic.color_token === tok ? "ring-2 ring-offset-2 ring-offset-surface ring-ink" : ""}`}
              title={tok}
            />
          ))}
        </div>
      </FieldRow>
      <FieldRow label="Sort order">
        <input
          type="number"
          value={topic.sort_order}
          onChange={(e) => onChange({ ...topic, sort_order: Number(e.target.value) || 0 })}
          className="ai-input w-24"
        />
      </FieldRow>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onSave}
          disabled={busy || !topic.slug.trim() || !topic.name.trim()}
          className="flex-1 px-3 py-2 rounded-md bg-cyan text-canvas text-[12px] font-semibold disabled:opacity-50"
        >
          {topic.id ? "Зберегти" : "Створити"}
        </button>
        {onDelete && (
          <button onClick={onDelete} className="px-3 py-2 rounded-md border border-bad/40 text-bad text-[12px] hover:bg-bad/[0.08]">
            Видалити
          </button>
        )}
      </div>

      <style jsx>{`
        .ai-input {
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
        .ai-input:focus { border-color: #5eb6ff; }
      `}</style>
    </div>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-1.5">{label}</div>
      {children}
      {hint && <div className="text-[10px] text-ink-mute mt-1">{hint}</div>}
    </div>
  );
}
