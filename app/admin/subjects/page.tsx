"use client";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase-client";
import { clearSubjectsCache } from "@/lib/subjects";
import { ACCENT_TOKENS, getAccent, type AccentToken } from "@/lib/accent";

interface Row {
  id: string;
  slug: string;
  name_uk: string;
  name_en: string;
  description: string | null;
  accent_color: string;
  sort_order: number;
}

export default function AdminSubjectsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await getSupabase()
      .from("subjects")
      .select("id, slug, name_uk, name_en, description, accent_color, sort_order")
      .order("sort_order");
    if (error) setErr(error.message);
    else setRows(data as Row[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save(r: Row) {
    setBusy(true); setErr(null);
    try {
      const payload = {
        slug: r.slug.trim().toLowerCase(),
        name_uk: r.name_uk.trim(),
        name_en: r.name_en.trim(),
        description: r.description?.trim() || null,
        accent_color: r.accent_color,
        sort_order: r.sort_order,
      };
      const sb = getSupabase();
      if (r.id) {
        const { error } = await sb.from("subjects").update(payload).eq("id", r.id);
        if (error) throw error;
      } else {
        const { error } = await sb.from("subjects").insert(payload);
        if (error) throw error;
      }
      clearSubjectsCache();
      await load();
      setEditing(null);
    } catch (e: any) { setErr(e?.message ?? String(e)); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm("Видалити предмет? Усі його питання та теми будуть втрачені.")) return;
    const { error } = await getSupabase().from("subjects").delete().eq("id", id);
    if (error) { setErr(error.message); return; }
    clearSubjectsCache();
    await load();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] min-h-full">
      <div className="px-6 sm:px-7 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="eyebrow">Адмін</div>
            <h1 className="text-[22px] font-semibold tracking-tighter2 mt-1">Предмети · {rows?.length ?? 0}</h1>
          </div>
          <button
            onClick={() => setEditing({ id: "", slug: "", name_uk: "", name_en: "", description: "", accent_color: "blue", sort_order: (rows?.length ?? 0) })}
            className="px-3 py-1.5 rounded-md bg-cyan text-canvas text-[12px] font-semibold"
          >
            + Новий предмет
          </button>
        </div>

        {err && <div className="text-bad text-sm mb-3">{err}</div>}
        {!rows && <div className="text-ink-mute text-sm">Завантаження…</div>}
        {rows && rows.length === 0 && (
          <div className="panel p-10 text-center space-y-2">
            <div className="text-[13px] text-ink-dim">Жодного предмета.</div>
          </div>
        )}
        {rows && rows.length > 0 && (
          <div className="panel divide-y divide-line overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_120px_90px_24px] gap-3 px-4 py-2 eyebrow border-b border-line">
              <span>#</span><span>Назва</span><span>Slug</span><span>Питань</span><span></span>
            </div>
            {rows.map((r) => {
              const a = getAccent(r.accent_color);
              return (
                <button
                  key={r.id}
                  onClick={() => setEditing(r)}
                  className="grid grid-cols-[40px_1fr_120px_90px_24px] gap-3 px-4 py-3 items-center hover:bg-surface transition-colors text-left"
                >
                  <span className={`size-6 rounded ${a.cta} ${a.ctaText} flex items-center justify-center text-[10px] font-semibold`}>
                    {r.name_uk.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[13px] font-medium truncate">{r.name_uk}</span>
                  <span className="text-[11px] text-ink-mute">{r.slug}</span>
                  <span className="text-[11px] text-ink-mute">—</span>
                  <span className="text-ink-mute">›</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor */}
      <aside className="border-t lg:border-t-0 lg:border-l border-line p-6 bg-surface">
        {editing ? (
          <Editor
            row={editing}
            onChange={setEditing}
            onSave={() => save(editing)}
            onCancel={() => setEditing(null)}
            onDelete={editing.id ? () => remove(editing.id) : undefined}
            busy={busy}
          />
        ) : (
          <div className="text-[13px] text-ink-mute">Обери предмет зі списку, щоб редагувати.</div>
        )}
      </aside>
    </div>
  );
}

function Editor({
  row, onChange, onSave, onCancel, onDelete, busy,
}: {
  row: Row;
  onChange: (r: Row) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  busy: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="eyebrow">{row.id ? "Редагування" : "Новий предмет"}</div>
        </div>
        <button onClick={onCancel} className="text-[11px] text-ink-mute hover:text-ink">закрити</button>
      </div>
      <Field label="Slug (URL)" hint="Тільки літери, цифри, дефіс. Не змінюй після створення!">
        <input
          value={row.slug}
          onChange={(e) => onChange({ ...row, slug: e.target.value })}
          placeholder="webapps"
          className="input"
        />
      </Field>
      <Field label="Назва (UK)">
        <input
          value={row.name_uk}
          onChange={(e) => onChange({ ...row, name_uk: e.target.value })}
          placeholder="Веб-програмування"
          className="input"
        />
      </Field>
      <Field label="Name (EN)">
        <input
          value={row.name_en}
          onChange={(e) => onChange({ ...row, name_en: e.target.value })}
          placeholder="Web Programming"
          className="input"
        />
      </Field>
      <Field label="Опис">
        <textarea
          value={row.description ?? ""}
          onChange={(e) => onChange({ ...row, description: e.target.value })}
          rows={3}
          className="input resize-y"
        />
      </Field>
      <Field label="Колір">
        <div className="grid grid-cols-5 gap-1.5">
          {ACCENT_TOKENS.map((tok) => {
            const a = getAccent(tok);
            const on = row.accent_color === tok;
            return (
              <button
                key={tok}
                onClick={() => onChange({ ...row, accent_color: tok })}
                className={`h-8 rounded ${a.cta} ${on ? "ring-2 ring-offset-2 ring-offset-surface ring-ink" : ""}`}
                title={tok}
              />
            );
          })}
        </div>
      </Field>
      <Field label="Sort order">
        <input
          type="number"
          value={row.sort_order}
          onChange={(e) => onChange({ ...row, sort_order: Number(e.target.value) || 0 })}
          className="input w-24"
        />
      </Field>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onSave}
          disabled={busy || !row.slug.trim() || !row.name_uk.trim()}
          className="flex-1 px-3 py-2 rounded-md bg-cyan text-canvas text-[12px] font-semibold disabled:opacity-50"
        >
          {row.id ? "Зберегти" : "Створити"}
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-2 rounded-md border border-bad/40 text-bad text-[12px] hover:bg-bad/[0.08]"
          >
            Видалити
          </button>
        )}
      </div>

      <style jsx>{`
        .input {
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
        .input:focus { border-color: #5eb6ff; }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-1.5">{label}</div>
      {children}
      {hint && <div className="text-[10px] text-ink-mute mt-1">{hint}</div>}
    </div>
  );
}
