"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/shell/TopBar";
import { AdminSideNav } from "@/components/shell/AdminSideNav";
import { useSession } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!session?.user) { setIsAdmin(false); return; }
    getSupabase()
      .from("profiles").select("is_admin").eq("id", session.user.id).maybeSingle()
      .then(({ data }) => setIsAdmin(!!data?.is_admin));
  }, [session, loading]);

  // Don't render — and don't 404 — until we know. Avoids a flash of "Перевіряємо…"
  // followed by either content or 404.
  if (loading || isAdmin === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-canvas">
        <div className="text-ink-mute text-sm">Перевіряємо доступ…</div>
      </div>
    );
  }

  // Non-admins (including guests) see the same 404 page that hitting a truly
  // non-existent URL would render — they don't even learn /admin exists.
  if (!isAdmin) notFound();

  return (
    <div className="h-screen flex flex-col bg-canvas">
      <TopBar crumbs={[{ label: "Адмін", href: "/admin" }]} />
      <div className="flex flex-1 min-h-0">
        <AdminSideNav />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="md:hidden p-6">
            <div className="panel p-8 text-center">
              <div className="text-[14px] font-medium">Адмін-панель — на десктопі</div>
              <p className="text-[12px] text-ink-dim mt-2 leading-relaxed">
                Інтерфейс редагування великий і вимагає миші. Відкрий цей URL на ноутбуці.
              </p>
            </div>
          </div>
          <div className="hidden md:block">{children}</div>
        </main>
      </div>
    </div>
  );
}
