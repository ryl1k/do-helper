"use client";
// Hidden route. Not linked from the navbar; reachable only by typing the URL.
// Reads from the public.user_leaderboard view (aggregated, no per-row PII).
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase-client";

interface Row {
  id: string;
  display_name: string;
  total: number;
  correct: number;
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    supabase
      .from("user_leaderboard")
      .select("id, display_name, total, correct")
      .order("correct", { ascending: false })
      .order("total", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setRows((data ?? []) as Row[]);
      });
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Leaderboard</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Aggregated across all signed-in users. Hidden from the main navigation.
        </p>
      </header>
      {err && <div className="text-sm text-red-500">{err}</div>}
      {!rows && !err && <div className="text-sm text-slate-500">Loading…</div>}
      {rows && rows.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center text-slate-500">
          No attempts recorded yet.
        </div>
      )}
      {rows && rows.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-3 py-2 w-10">#</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2 text-right">Correct</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {rows.map((r, i) => {
                const acc = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
                return (
                  <tr key={r.id}>
                    <td className="px-3 py-2 tabular-nums text-slate-500">{i + 1}</td>
                    <td className="px-3 py-2 font-medium truncate">{r.display_name}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.correct}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.total}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium text-blue-600 dark:text-sky-400">{acc}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
