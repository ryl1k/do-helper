"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { getSupabase } from "@/lib/supabase-client";

interface Row { id: string; display_name: string; total: number; correct: number }

export default function LeaderboardPage() {
  const { subject } = useParams<{ subject: string }>();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!subject) return;
    (async () => {
      const sb = getSupabase();
      const { data: subj } = await sb.from("subjects").select("id").eq("slug", subject).maybeSingle();
      if (!subj) { setErr("subject not found"); return; }
      const { data, error } = await sb.from("user_leaderboard")
        .select("id, display_name, total, correct")
        .eq("subject_id", subj.id)
        .order("correct", { ascending: false })
        .order("total", { ascending: false })
        .limit(100);
      if (error) setErr(error.message);
      else setRows(data as Row[]);
    })();
  }, [subject]);

  return (
    <AppShell active="subjects" subject={subject} crumbs={[
      { label: subject, href: `/${subject}` },
      { label: "Leaderboard" },
    ]}>
      <div className="px-6 sm:px-10 py-6 max-w-3xl">
        <div className="eyebrow">Hidden route</div>
        <h1 className="text-[22px] font-semibold tracking-tighter2 mt-1">Leaderboard</h1>
        <p className="text-[13px] text-ink-dim mt-1">Зведено по всіх авторизованих користувачах цього предмета. У головній навігації приховано.</p>

        {err && <div className="text-bad text-sm mt-3">{err}</div>}
        {!rows && !err && <div className="text-ink-mute text-sm mt-3">Завантаження…</div>}
        {rows && rows.length === 0 && (
          <div className="panel p-8 text-center text-ink-mute text-sm mt-4">Поки немає сесій від авторизованих користувачів.</div>
        )}
        {rows && rows.length > 0 && (
          <div className="panel overflow-hidden mt-4">
            <div className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-3 px-4 py-2 eyebrow border-b border-line">
              <span>#</span><span>Ім'я</span><span>Прав.</span><span>Усього</span><span>Точність</span>
            </div>
            <div className="divide-y divide-line">
              {rows.map((r, i) => {
                const acc = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
                return (
                  <div key={r.id} className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-3 px-4 py-2.5 items-center">
                    <span className="font-mono text-[11px] text-ink-mute">{i + 1}</span>
                    <span className="text-[13px] truncate">{r.display_name}</span>
                    <span className="font-mono text-[12px] text-ink-dim">{r.correct}</span>
                    <span className="font-mono text-[12px] text-ink-dim">{r.total}</span>
                    <span className="font-mono text-[12px] text-cyan font-medium">{acc}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
