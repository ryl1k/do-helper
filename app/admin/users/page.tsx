"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase-client";

interface User { id: string; display_name: string | null; is_admin: boolean; created_at: string }

export default function AdminUsersPage() {
  const [rows, setRows] = useState<User[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("profiles")
      .select("id, display_name, is_admin, created_at")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setRows(data as User[]);
      });
  }, []);

  async function toggleAdmin(u: User) {
    if (!confirm(`${u.is_admin ? "Зняти" : "Надати"} адмін-права для ${u.display_name ?? u.id}?`)) return;
    const { error } = await getSupabase().from("profiles").update({ is_admin: !u.is_admin }).eq("id", u.id);
    if (error) { alert(error.message); return; }
    setRows((rs) => rs?.map((r) => r.id === u.id ? { ...r, is_admin: !u.is_admin } : r) ?? null);
  }

  return (
    <div className="px-6 sm:px-7 py-6 max-w-4xl">
      <div className="eyebrow">Адмін</div>
      <h1 className="text-[22px] font-semibold tracking-tighter2 mt-1">Студенти · {rows?.length ?? 0}</h1>
      {err && <div className="text-bad text-sm mt-3">{err}</div>}
      {!rows && <div className="text-ink-mute text-sm mt-3">Завантаження…</div>}
      {rows && (
        <div className="panel divide-y divide-line overflow-hidden mt-4">
          <div className="grid grid-cols-[1fr_140px_80px_100px] gap-3 px-4 py-2 eyebrow border-b border-line">
            <span>Ім'я</span><span>Створено</span><span>Адмін</span><span></span>
          </div>
          {rows.map((u) => (
            <div key={u.id} className="grid grid-cols-[1fr_140px_80px_100px] gap-3 px-4 py-3 items-center">
              <span className="text-[13px] truncate">{u.display_name ?? <span className="text-ink-mute italic">без імені</span>}</span>
              <span className="text-[11px] text-ink-mute">{new Date(u.created_at).toLocaleDateString()}</span>
              <span className={"text-[11px] " + (u.is_admin ? "text-cyan" : "text-ink-mute")}>{u.is_admin ? "так" : "—"}</span>
              <button
                onClick={() => toggleAdmin(u)}
                className="text-[11px] text-ink-dim hover:text-ink underline justify-self-end"
              >
                {u.is_admin ? "Зняти" : "Надати"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
